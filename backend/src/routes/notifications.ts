import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import pool from "../config/db";

const router = Router();

// Global SSE client store: userId -> Response[]
export const sseClients = new Map<string, Response[]>();

// GET /api/notifications/stream — SSE connection (token via query param for EventSource)
router.get("/stream", authenticate, (req: AuthRequest, res: Response): void => {
  const userId = req.user!.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.flushHeaders();

  if (!sseClients.has(userId)) sseClients.set(userId, []);
  sseClients.get(userId)!.push(res);

  // Send heartbeat every 25s to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    const clients = sseClients.get(userId) || [];
    sseClients.set(userId, clients.filter((c) => c !== res));
  });
});

router.use(authenticate);

// GET /api/notifications — list user's notifications
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { limit = 30, offset = 0, unreadOnly = "false" } = req.query as Record<string, string>;

  try {
    let query = `SELECT id, type, title, message, is_read, metadata, created_at
                 FROM notifications WHERE user_id = $1`;
    const params: (string | number | boolean)[] = [userId];

    if (unreadOnly === "true") {
      query += ` AND is_read = false`;
    }
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), Number(offset));

    const result = await pool.query(query, params);
    const unreadCount = await pool.query(
      `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`,
      [userId]
    );

    res.json({ notifications: result.rows, unreadCount: Number(unreadCount.rows[0].count) });
  } catch (err) {
    console.error("Notification list error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// PATCH /api/notifications/:id/read — mark as read
router.patch("/:id/read", async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// PATCH /api/notifications/read-all — mark all as read
router.patch("/read-all", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
      [req.user!.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all read" });
  }
});

// POST /api/notifications/send — send notification to user(s) (teacher/principal)
router.post(
  "/send",
  authorize("teacher", "principal", "moe"),
  [
    body("userIds").isArray({ min: 1 }),
    body("userIds.*").isUUID(),
    body("type").notEmpty().isString(),
    body("title").notEmpty().isString().isLength({ max: 255 }),
    body("message").notEmpty().isString().isLength({ max: 1000 }),
    body("metadata").optional().isObject(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userIds, type, title, message, metadata } = req.body as {
      userIds: string[];
      type: string;
      title: string;
      message: string;
      metadata?: Record<string, unknown>;
    };
    const schoolId = req.user!.schoolId;

    try {
      const insertedIds: string[] = [];

      for (const userId of userIds) {
        const result = await pool.query(
          `INSERT INTO notifications (user_id, school_id, type, title, message, metadata)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [userId, schoolId, type, title, message, metadata ? JSON.stringify(metadata) : null]
        );
        insertedIds.push(result.rows[0].id);

        // Push via SSE if user is connected
        pushSSE(userId, { type, title, message, metadata, id: result.rows[0].id });
      }

      res.json({ success: true, count: insertedIds.length });
    } catch (err) {
      console.error("Send notification error:", err);
      res.status(500).json({ error: "Failed to send notification" });
    }
  }
);

// POST /api/notifications/broadcast — send to entire school/class
router.post(
  "/broadcast",
  authorize("teacher", "principal"),
  [
    body("targetClass").optional().isString(),
    body("roles").optional().isArray(),
    body("type").notEmpty().isString(),
    body("title").notEmpty().isString(),
    body("message").notEmpty().isString(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { targetClass, roles, type, title, message } = req.body as {
      targetClass?: string;
      roles?: string[];
      type: string;
      title: string;
      message: string;
    };
    const schoolId = req.user!.schoolId;

    try {
      let userQuery = `SELECT id FROM users WHERE school_id = $1`;
      const params: (string | string[])[] = [schoolId];

      if (roles && roles.length > 0) {
        params.push(roles);
        userQuery += ` AND role = ANY($${params.length})`;
      }

      const users = await pool.query(userQuery, params);
      let count = 0;

      for (const user of users.rows) {
        if (targetClass) {
          const isInClass = await pool.query(
            `SELECT 1 FROM students WHERE school_id = $1 AND class = $2
             AND id IN (SELECT id FROM students WHERE id = $3) LIMIT 1`,
            [schoolId, targetClass, user.id]
          );
          if (!isInClass.rows.length) continue;
        }

        const result = await pool.query(
          `INSERT INTO notifications (user_id, school_id, type, title, message)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [user.id, schoolId, type, title, message]
        );
        pushSSE(user.id, { type, title, message, id: result.rows[0].id });
        count++;
      }

      res.json({ success: true, count });
    } catch (err) {
      console.error("Broadcast error:", err);
      res.status(500).json({ error: "Failed to broadcast" });
    }
  }
);

// DELETE /api/notifications/:id
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      `DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user!.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export function pushSSE(userId: string, data: Record<string, unknown>) {
  const clients = sseClients.get(userId) || [];
  for (const client of clients) {
    try {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch {
      // client disconnected
    }
  }
}

export default router;
