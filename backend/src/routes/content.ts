import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import pool from "../config/db";

const router = Router();
router.use(authenticate);

// GET /api/content — list content items for a school
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  const { type, subject, limit = 30, offset = 0, publishedOnly = "true" } = req.query as Record<string, string>;

  try {
    let query = `SELECT ci.id, ci.title, ci.subject, ci.type, ci.content, ci.file_url,
                        ci.duration, ci.is_ai_generated, ci.is_published, ci.views,
                        ci.created_at, u.name as creator_name
                 FROM content_items ci JOIN users u ON u.id = ci.created_by
                 WHERE ci.school_id = $1`;
    const params: (string | number | boolean)[] = [schoolId];

    if (publishedOnly === "true") query += ` AND ci.is_published = true`;
    if (type) { params.push(type); query += ` AND ci.type = $${params.length}`; }
    if (subject) { params.push(subject); query += ` AND ci.subject ILIKE $${params.length}`; }

    query += ` ORDER BY ci.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), Number(offset));

    const result = await pool.query(query, params);
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM content_items WHERE school_id = $1 AND ($2::text IS NULL OR type = $2)`,
      [schoolId, type || null]
    );

    res.json({ items: result.rows, total: Number(countResult.rows[0].count) });
  } catch (err) {
    console.error("Content list error:", err);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

// GET /api/content/:id — single content item
router.get("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  try {
    const result = await pool.query(
      `SELECT ci.*, u.name as creator_name FROM content_items ci
       JOIN users u ON u.id = ci.created_by
       WHERE ci.id = $1 AND ci.school_id = $2`,
      [req.params.id, schoolId]
    );
    if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

// POST /api/content — create content item
router.post(
  "/",
  authorize("teacher", "principal"),
  [
    body("title").notEmpty().isString().isLength({ max: 500 }),
    body("type").isIn(["video", "podcast", "notes", "flashcards", "presentation", "test", "lesson_plan", "diagram"]),
    body("subject").optional().isString(),
    body("content").optional().isString(),
    body("fileUrl").optional().isURL(),
    body("duration").optional().isString(),
    body("isAiGenerated").optional().isBoolean(),
    body("isPublished").optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { title, type, subject, content, fileUrl, duration, isAiGenerated = false, isPublished = false } = req.body as {
      title: string; type: string; subject?: string; content?: string;
      fileUrl?: string; duration?: string; isAiGenerated?: boolean; isPublished?: boolean;
    };

    try {
      const result = await pool.query(
        `INSERT INTO content_items (school_id, created_by, title, subject, type, content, file_url, duration, is_ai_generated, is_published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [req.user!.schoolId, req.user!.id, title, subject, type, content, fileUrl, duration, isAiGenerated, isPublished]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create content" });
    }
  }
);

// PUT /api/content/:id — update content
router.put("/:id", authorize("teacher", "principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, subject, content, fileUrl, duration, isPublished } = req.body as {
    title?: string; subject?: string; content?: string;
    fileUrl?: string; duration?: string; isPublished?: boolean;
  };

  try {
    const result = await pool.query(
      `UPDATE content_items SET title = COALESCE($1, title), subject = COALESCE($2, subject),
       content = COALESCE($3, content), file_url = COALESCE($4, file_url),
       duration = COALESCE($5, duration), is_published = COALESCE($6, is_published),
       updated_at = NOW()
       WHERE id = $7 AND school_id = $8 AND created_by = $9 RETURNING *`,
      [title, subject, content, fileUrl, duration, isPublished, req.params.id, req.user!.schoolId, req.user!.id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: "Not found or not authorized" }); return; }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update content" });
  }
});

// PATCH /api/content/:id/publish — toggle publish
router.patch("/:id/publish", authorize("teacher", "principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `UPDATE content_items SET is_published = NOT is_published, updated_at = NOW()
       WHERE id = $1 AND school_id = $2 RETURNING is_published`,
      [req.params.id, req.user!.schoolId]
    );
    if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ isPublished: result.rows[0].is_published });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle publish" });
  }
});

// DELETE /api/content/:id
router.delete("/:id", authorize("teacher", "principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      `DELETE FROM content_items WHERE id = $1 AND school_id = $2 AND created_by = $3`,
      [req.params.id, req.user!.schoolId, req.user!.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete content" });
  }
});

// POST /api/content/:id/view — track student view
router.post("/:id/view", async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  try {
    const studentResult = await pool.query(`SELECT id FROM students WHERE school_id = $1 LIMIT 1`, [req.user!.schoolId]);
    if (!studentResult.rows[0]) { res.json({ success: true }); return; }

    await pool.query(
      `INSERT INTO content_views (content_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.params.id, studentResult.rows[0].id]
    );
    await pool.query(
      `UPDATE content_items SET views = views + 1 WHERE id = $1`,
      [req.params.id]
    );
    void userId;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to track view" });
  }
});

// POST /api/content/:id/deliver — push content to a class
router.post(
  "/:id/deliver",
  authorize("teacher", "principal"),
  [
    body("targetClass").notEmpty().isString(),
    body("message").optional().isString(),
    body("scheduledAt").optional().isISO8601(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { targetClass, message, scheduledAt } = req.body as {
      targetClass: string; message?: string; scheduledAt?: string;
    };

    try {
      await pool.query(
        `INSERT INTO content_deliveries (content_id, assigned_to_class, school_id, assigned_by, message, scheduled_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [req.params.id, targetClass, req.user!.schoolId, req.user!.id, message, scheduledAt || null]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to deliver content" });
    }
  }
);

// GET /api/content/deliveries/class/:className — content assigned to a class
router.get("/deliveries/class/:className", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  const { className } = req.params;

  try {
    const result = await pool.query(
      `SELECT cd.*, ci.title, ci.type, ci.subject, ci.content, ci.file_url, u.name as teacher_name
       FROM content_deliveries cd
       JOIN content_items ci ON ci.id = cd.content_id
       JOIN users u ON u.id = cd.assigned_by
       WHERE cd.school_id = $1 AND cd.assigned_to_class = $2
       AND (cd.scheduled_at IS NULL OR cd.scheduled_at <= NOW())
       ORDER BY cd.delivered_at DESC LIMIT 50`,
      [schoolId, className]
    );
    res.json({ deliveries: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

export default router;
