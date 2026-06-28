import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { pushSSE } from "./notifications";
import pool from "../config/db";

const router = Router();
router.use(authenticate);

// GET /api/safety/events — list safety events
router.get("/events", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  const { status, limit = 20 } = req.query as { status?: string; limit?: string };

  try {
    let query = `SELECT se.*, u.name as triggered_by_name FROM safety_events se
                 JOIN users u ON u.id = se.triggered_by
                 WHERE se.school_id = $1`;
    const params: (string | number)[] = [schoolId];

    if (status) { params.push(status); query += ` AND se.status = $${params.length}`; }
    query += ` ORDER BY se.triggered_at DESC LIMIT $${params.length + 1}`;
    params.push(Number(limit));

    const result = await pool.query(query, params);
    res.json({ events: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch safety events" });
  }
});

// GET /api/safety/active — get current active emergency
router.get("/active", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT se.*, u.name as triggered_by_name FROM safety_events se
       JOIN users u ON u.id = se.triggered_by
       WHERE se.school_id = $1 AND se.status = 'active'
       ORDER BY se.triggered_at DESC LIMIT 1`,
      [req.user!.schoolId]
    );
    res.json({ event: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active event" });
  }
});

// POST /api/safety/trigger — trigger emergency alert
router.post(
  "/trigger",
  authorize("teacher", "principal"),
  [
    body("type").isIn(["fire", "medical", "security", "lockdown", "drill", "other"]),
    body("notes").optional().isString().isLength({ max: 1000 }),
    body("headcountTotal").optional().isInt({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { type, notes, headcountTotal } = req.body as {
      type: string; notes?: string; headcountTotal?: number;
    };
    const schoolId = req.user!.schoolId;
    const userId = req.user!.id;

    try {
      const result = await pool.query(
        `INSERT INTO safety_events (school_id, type, triggered_by, notes, headcount_total)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [schoolId, type, userId, notes, headcountTotal]
      );

      // Notify all school staff via SSE
      const staff = await pool.query(
        `SELECT id FROM users WHERE school_id = $1 AND role IN ('teacher', 'principal')`,
        [schoolId]
      );
      for (const s of staff.rows) {
        pushSSE(s.id, {
          type: "SAFETY_ALERT",
          title: `🚨 ${type.toUpperCase()} EMERGENCY`,
          message: notes || `Emergency alert triggered at school`,
          eventId: result.rows[0].id,
          severity: "critical",
        });

        await pool.query(
          `INSERT INTO notifications (user_id, school_id, type, title, message, metadata)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            s.id, schoolId, "safety_alert",
            `🚨 ${type.toUpperCase()} EMERGENCY`,
            notes || `Emergency alert triggered`,
            JSON.stringify({ eventId: result.rows[0].id, type }),
          ]
        );
      }

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Safety trigger error:", err);
      res.status(500).json({ error: "Failed to trigger emergency" });
    }
  }
);

// PATCH /api/safety/events/:id/headcount — update headcount
router.patch(
  "/events/:id/headcount",
  authorize("teacher", "principal"),
  [
    body("headcountSafe").isInt({ min: 0 }),
    body("headcountTotal").optional().isInt({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { headcountSafe, headcountTotal } = req.body as {
      headcountSafe: number; headcountTotal?: number;
    };

    try {
      const result = await pool.query(
        `UPDATE safety_events SET headcount_safe = $1,
         headcount_total = COALESCE($2, headcount_total)
         WHERE id = $3 AND school_id = $4 RETURNING *`,
        [headcountSafe, headcountTotal, req.params.id, req.user!.schoolId]
      );
      if (!result.rows[0]) { res.status(404).json({ error: "Event not found" }); return; }

      // Broadcast headcount update
      const staff = await pool.query(
        `SELECT id FROM users WHERE school_id = $1 AND role IN ('teacher', 'principal')`,
        [req.user!.schoolId]
      );
      for (const s of staff.rows) {
        pushSSE(s.id, {
          type: "HEADCOUNT_UPDATE",
          eventId: req.params.id,
          headcountSafe,
          headcountTotal: result.rows[0].headcount_total,
        });
      }

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update headcount" });
    }
  }
);

// PATCH /api/safety/events/:id/resolve — resolve emergency
router.patch(
  "/events/:id/resolve",
  authorize("teacher", "principal"),
  [body("notes").optional().isString()],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { notes } = req.body as { notes?: string };

    try {
      const result = await pool.query(
        `UPDATE safety_events SET status = 'resolved', resolved_at = NOW(),
         notes = COALESCE($1, notes)
         WHERE id = $2 AND school_id = $3 RETURNING *`,
        [notes, req.params.id, req.user!.schoolId]
      );
      if (!result.rows[0]) { res.status(404).json({ error: "Event not found" }); return; }

      // Broadcast all-clear
      const staff = await pool.query(
        `SELECT id FROM users WHERE school_id = $1 AND role IN ('teacher', 'principal')`,
        [req.user!.schoolId]
      );
      for (const s of staff.rows) {
        pushSSE(s.id, {
          type: "SAFETY_RESOLVED",
          title: "✅ Emergency Resolved",
          message: notes || "The emergency situation has been resolved",
          eventId: req.params.id,
        });
      }

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to resolve event" });
    }
  }
);

export default router;
