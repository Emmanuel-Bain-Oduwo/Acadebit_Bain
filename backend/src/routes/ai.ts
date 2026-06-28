import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { authenticate, AuthRequest } from "../middleware/auth";
import { generateText, streamText, chat, teacherVoiceQuery, generateWithGemini, isMediaTool, ChatMessage } from "../services/ai";
import pool from "../config/db";

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many AI requests — please wait a minute" },
});

router.use(authenticate);
router.use(aiLimiter);

// POST /api/ai/generate — generate content (lesson plan, notes, exam, etc.)
router.post(
  "/generate",
  [
    body("toolType").notEmpty().isString(),
    body("prompt").notEmpty().isString().isLength({ max: 4000 }),
    body("context").optional().isString().isLength({ max: 2000 }),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { toolType, prompt, context } = req.body as { toolType: string; prompt: string; context?: string };
    const userId = req.user!.id;
    const schoolId = req.user!.schoolId;

    try {
      let result;
      if (isMediaTool(toolType)) {
        result = await generateWithGemini(prompt, toolType);
      } else {
        result = await generateText({ toolType, prompt, context });
      }

      await pool.query(
        `INSERT INTO ai_generations (user_id, school_id, tool_type, prompt, output, provider, model, tokens_used)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, schoolId, toolType, prompt, result.output, result.provider, result.model, result.tokensUsed]
      );

      // Award XP for AI generation
      await awardXP(userId, schoolId, "ai_generate", 5);

      res.json({ output: result.output, provider: result.provider, model: result.model });
    } catch (err) {
      console.error("AI generate error:", err);
      res.status(500).json({ error: "Failed to generate content" });
    }
  }
);

// POST /api/ai/generate/stream — SSE streaming generation
router.post(
  "/generate/stream",
  [body("toolType").notEmpty(), body("prompt").notEmpty().isLength({ max: 4000 })],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { toolType, prompt } = req.body as { toolType: string; prompt: string };

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let fullOutput = "";
    try {
      for await (const chunk of streamText({ toolType, prompt })) {
        fullOutput += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      await pool.query(
        `INSERT INTO ai_generations (user_id, school_id, tool_type, prompt, output, provider, model, tokens_used)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [req.user!.id, req.user!.schoolId, toolType, prompt, fullOutput, "deepseek", "deepseek-chat", 0]
      );

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } catch (err) {
      console.error("Stream error:", err);
      res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
    } finally {
      res.end();
    }
  }
);

// POST /api/ai/chat — multi-turn conversation (student AI tutor)
router.post(
  "/chat",
  [
    body("messages").isArray({ min: 1, max: 50 }),
    body("messages.*.role").isIn(["user", "assistant"]),
    body("messages.*.content").notEmpty().isString().isLength({ max: 2000 }),
    body("useKimi").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { messages, useKimi } = req.body as { messages: ChatMessage[]; useKimi?: boolean };
    const toolType = req.user!.role === "teacher" ? "teacher_voice" : "chat";

    try {
      const result = await chat(messages, toolType, useKimi);

      await pool.query(
        `INSERT INTO ai_generations (user_id, school_id, tool_type, prompt, output, provider, model, tokens_used)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          req.user!.id, req.user!.schoolId, "chat",
          messages[messages.length - 1]?.content || "",
          result.output, result.provider, result.model, result.tokensUsed,
        ]
      );

      await awardXP(req.user!.id, req.user!.schoolId, "ai_chat", 3);

      res.json({ reply: result.output, provider: result.provider });
    } catch (err) {
      console.error("Chat error:", err);
      res.status(500).json({ error: "Chat failed" });
    }
  }
);

// POST /api/ai/voice — teacher voice assistant query
router.post(
  "/voice",
  [body("query").notEmpty().isString().isLength({ max: 2000 })],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { query } = req.body as { query: string };

    try {
      const result = await teacherVoiceQuery(query);

      await pool.query(
        `INSERT INTO ai_generations (user_id, school_id, tool_type, prompt, output, provider, model, tokens_used)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [req.user!.id, req.user!.schoolId, "teacher_voice", query, result.output, result.provider, result.model, result.tokensUsed]
      );

      res.json({ response: result.output, provider: result.provider });
    } catch (err) {
      console.error("Voice error:", err);
      res.status(500).json({ error: "Voice query failed" });
    }
  }
);

// GET /api/ai/history — user's AI generation history
router.get("/history", async (req: AuthRequest, res: Response): Promise<void> => {
  const { limit = 20, offset = 0, toolType } = req.query as { limit?: string; offset?: string; toolType?: string };

  try {
    let query = `SELECT id, tool_type, prompt, output, provider, model, tokens_used, created_at
                 FROM ai_generations WHERE user_id = $1`;
    const params: (string | number)[] = [req.user!.id];

    if (toolType) {
      params.push(toolType);
      query += ` AND tool_type = $${params.length}`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), Number(offset));

    const result = await pool.query(query, params);
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM ai_generations WHERE user_id = $1`,
      [req.user!.id]
    );

    res.json({ items: result.rows, total: Number(countResult.rows[0].count) });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// POST /api/ai/push — push AI-generated content to a class
router.post(
  "/push",
  [
    body("contentId").optional().isUUID(),
    body("output").optional().isString(),
    body("toolType").notEmpty().isString(),
    body("targetClass").notEmpty().isString(),
    body("message").optional().isString(),
    body("scheduledAt").optional().isISO8601(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { output, toolType, targetClass, message, scheduledAt, contentId } = req.body as {
      output?: string;
      toolType: string;
      targetClass: string;
      message?: string;
      scheduledAt?: string;
      contentId?: string;
    };

    const schoolId = req.user!.schoolId;
    const userId = req.user!.id;

    try {
      let itemId = contentId;

      if (!itemId && output) {
        const contentResult = await pool.query(
          `INSERT INTO content_items (school_id, created_by, title, type, content, is_ai_generated, is_published)
           VALUES ($1, $2, $3, $4, $5, true, true) RETURNING id`,
          [schoolId, userId, `${toolType} - ${new Date().toLocaleDateString()}`, toolType, output]
        );
        itemId = contentResult.rows[0].id;
      }

      if (itemId) {
        await pool.query(
          `INSERT INTO content_deliveries (content_id, assigned_to_class, school_id, assigned_by, message, scheduled_at)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [itemId, targetClass, schoolId, userId, message || null, scheduledAt || null]
        );
      }

      res.json({ success: true, contentId: itemId });
    } catch (err) {
      console.error("Push error:", err);
      res.status(500).json({ error: "Failed to push content" });
    }
  }
);

// GET /api/ai/school-stats — school-wide AI usage stats (principal/teacher)
router.get("/school-stats", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  try {
    const result = await pool.query(
      `SELECT tool_type, COUNT(*) as count, SUM(tokens_used) as total_tokens
       FROM ai_generations WHERE school_id = $1
       GROUP BY tool_type ORDER BY count DESC`,
      [schoolId]
    );
    res.json({ stats: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

async function awardXP(userId: string, schoolId: string, action: string, xp: number) {
  try {
    await pool.query(
      `INSERT INTO user_xp (user_id, school_id, total_xp, last_active_date)
       VALUES ($1, $2, $3, CURRENT_DATE)
       ON CONFLICT (user_id) DO UPDATE SET
         total_xp = user_xp.total_xp + $3,
         last_active_date = CURRENT_DATE,
         updated_at = NOW()`,
      [userId, schoolId, xp]
    );
    await pool.query(
      `INSERT INTO xp_transactions (user_id, action, xp_earned) VALUES ($1, $2, $3)`,
      [userId, action, xp]
    );
  } catch (err) {
    console.error("XP award error:", err);
  }
}

export default router;
