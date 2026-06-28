import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { awardXPAndCheckBadges } from "./gamification";
import pool from "../config/db";

const router = Router();
router.use(authenticate);

// GET /api/competitions — list competitions for school
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  const { status, grade } = req.query as { status?: string; grade?: string };

  try {
    let query = `SELECT c.*, u.name as created_by_name,
                   (SELECT COUNT(*) FROM competition_scores cs WHERE cs.competition_id = c.id) as participant_count
                 FROM competitions c JOIN users u ON u.id = c.created_by
                 WHERE c.school_id = $1`;
    const params: string[] = [schoolId];

    if (status) { params.push(status); query += ` AND c.status = $${params.length}`; }
    if (grade) { params.push(grade); query += ` AND c.grade = $${params.length}`; }

    query += ` ORDER BY c.start_time DESC LIMIT 50`;
    const result = await pool.query(query, params);
    res.json({ competitions: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch competitions" });
  }
});

// GET /api/competitions/:id — single competition with leaderboard
router.get("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const comp = await pool.query(`SELECT * FROM competitions WHERE id = $1`, [id]);
    if (!comp.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

    const scores = await pool.query(
      `SELECT cs.score, cs.time_taken_seconds, cs.submitted_at,
              s.name as student_name, s.adm_no, s.class,
              RANK() OVER (ORDER BY cs.score DESC, cs.time_taken_seconds ASC) as rank
       FROM competition_scores cs JOIN students s ON s.id = cs.student_id
       WHERE cs.competition_id = $1
       ORDER BY cs.score DESC, cs.time_taken_seconds ASC LIMIT 100`,
      [id]
    );

    res.json({ competition: comp.rows[0], leaderboard: scores.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch competition" });
  }
});

// POST /api/competitions — create competition (teacher/principal)
router.post(
  "/",
  authorize("teacher", "principal"),
  [
    body("name").notEmpty().isString().isLength({ max: 255 }),
    body("type").isIn(["class", "school", "national"]),
    body("subject").optional().isString(),
    body("grade").optional().isString(),
    body("startTime").optional().isISO8601(),
    body("endTime").optional().isISO8601(),
    body("prize").optional().isString(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { name, type, subject, grade, startTime, endTime, prize } = req.body as {
      name: string; type: string; subject?: string; grade?: string;
      startTime?: string; endTime?: string; prize?: string;
    };

    try {
      const result = await pool.query(
        `INSERT INTO competitions (school_id, name, type, subject, grade, start_time, end_time, prize, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [req.user!.schoolId, name, type, subject, grade, startTime, endTime, prize, req.user!.id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create competition" });
    }
  }
);

// PATCH /api/competitions/:id/status — update status (live/ended/planned)
router.patch(
  "/:id/status",
  authorize("teacher", "principal"),
  [body("status").isIn(["planned", "live", "ended"])],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    try {
      const result = await pool.query(
        `UPDATE competitions SET status = $1 WHERE id = $2 AND school_id = $3 RETURNING *`,
        [req.body.status, req.params.id, req.user!.schoolId]
      );
      if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

      // If ended, award XP to top 3
      if (req.body.status === "ended") {
        const top3 = await pool.query(
          `SELECT cs.student_id, s.school_id,
                  ROW_NUMBER() OVER (ORDER BY cs.score DESC, cs.time_taken_seconds ASC) as rank
           FROM competition_scores cs JOIN students s ON s.id = cs.student_id
           WHERE cs.competition_id = $1 LIMIT 3`,
          [req.params.id]
        );

        for (const row of top3.rows) {
          const xpMap: Record<string, number> = { "1": 100, "2": 60, "3": 30 };
          const xp = xpMap[row.rank] || 10;
          await awardXPAndCheckBadges(row.student_id, row.school_id, "competition_win", xp);
        }
      }

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update status" });
    }
  }
);

// POST /api/competitions/:id/submit — submit score
router.post(
  "/:id/submit",
  [
    body("studentId").isUUID(),
    body("score").isNumeric(),
    body("timeTakenSeconds").optional().isInt({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { studentId, score, timeTakenSeconds } = req.body as {
      studentId: string; score: number; timeTakenSeconds?: number;
    };

    try {
      const comp = await pool.query(`SELECT status FROM competitions WHERE id = $1`, [req.params.id]);
      if (!comp.rows[0] || comp.rows[0].status !== "live") {
        res.status(400).json({ error: "Competition is not live" }); return;
      }

      await pool.query(
        `INSERT INTO competition_scores (competition_id, student_id, score, time_taken_seconds)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (competition_id, student_id) DO UPDATE SET score = EXCLUDED.score, time_taken_seconds = EXCLUDED.time_taken_seconds`,
        [req.params.id, studentId, score, timeTakenSeconds || null]
      );

      if (score === 100) {
        await awardXPAndCheckBadges(studentId, req.user!.schoolId, "perfect_score", 50);
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to submit score" });
    }
  }
);

// DELETE /api/competitions/:id
router.delete("/:id", authorize("teacher", "principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      `DELETE FROM competitions WHERE id = $1 AND school_id = $2`,
      [req.params.id, req.user!.schoolId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete competition" });
  }
});

export default router;
