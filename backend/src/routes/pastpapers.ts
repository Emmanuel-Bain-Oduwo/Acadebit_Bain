import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { awardXPAndCheckBadges } from "./gamification";
import pool from "../config/db";

const router = Router();
router.use(authenticate);

// GET /api/pastpapers — list past papers
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  const { subject, examType, year, grade, limit = 30, offset = 0 } = req.query as Record<string, string>;

  try {
    let query = `SELECT pp.*, u.name as uploaded_by_name
                 FROM past_papers pp JOIN users u ON u.id = pp.uploaded_by
                 WHERE pp.school_id = $1`;
    const params: (string | number)[] = [schoolId];

    if (subject) { params.push(subject); query += ` AND pp.subject ILIKE $${params.length}`; }
    if (examType) { params.push(examType); query += ` AND pp.exam_type = $${params.length}`; }
    if (year) { params.push(Number(year)); query += ` AND pp.year = $${params.length}`; }
    if (grade) { params.push(grade); query += ` AND pp.grade = $${params.length}`; }

    query += ` ORDER BY pp.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), Number(offset));

    const result = await pool.query(query, params);
    const total = await pool.query(
      `SELECT COUNT(*) FROM past_papers WHERE school_id = $1`,
      [schoolId]
    );

    res.json({ papers: result.rows, total: Number(total.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch past papers" });
  }
});

// GET /api/pastpapers/:id — single past paper
router.get("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT pp.*, u.name as uploaded_by_name FROM past_papers pp
       JOIN users u ON u.id = pp.uploaded_by WHERE pp.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

    // Increment download count
    await pool.query(
      `UPDATE past_papers SET download_count = download_count + 1 WHERE id = $1`,
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch past paper" });
  }
});

// POST /api/pastpapers — upload/create past paper record
router.post(
  "/",
  authorize("teacher", "principal", "moe"),
  [
    body("title").notEmpty().isString().isLength({ max: 500 }),
    body("subject").notEmpty().isString(),
    body("examType").isIn(["KCSE", "KCPE", "CBC", "MOCK", "CAT", "TERM"]),
    body("year").optional().isInt({ min: 1990, max: 2100 }),
    body("grade").optional().isString(),
    body("fileUrl").optional().isString(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { title, subject, examType, year, grade, fileUrl } = req.body as {
      title: string; subject: string; examType: string;
      year?: number; grade?: string; fileUrl?: string;
    };

    try {
      const result = await pool.query(
        `INSERT INTO past_papers (school_id, title, subject, exam_type, year, grade, file_url, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [req.user!.schoolId, title, subject, examType, year, grade, fileUrl, req.user!.id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create past paper" });
    }
  }
);

// DELETE /api/pastpapers/:id
router.delete("/:id", authorize("teacher", "principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      `DELETE FROM past_papers WHERE id = $1 AND school_id = $2`,
      [req.params.id, req.user!.schoolId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete past paper" });
  }
});

// POST /api/pastpapers/:id/attempt — record a student's attempt
router.post(
  "/:id/attempt",
  [
    body("studentId").isUUID(),
    body("score").optional().isNumeric(),
    body("timeTakenSeconds").optional().isInt({ min: 0 }),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { studentId, score, timeTakenSeconds } = req.body as {
      studentId: string; score?: number; timeTakenSeconds?: number;
    };

    try {
      const result = await pool.query(
        `INSERT INTO past_paper_attempts (paper_id, student_id, score, time_taken_seconds)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.params.id, studentId, score ?? null, timeTakenSeconds ?? null]
      );

      // Award XP for attempting; bonus for high scores
      const xp = score && score >= 80 ? 30 : 15;
      await awardXPAndCheckBadges(studentId, req.user!.schoolId, "past_paper_attempt", xp);

      // Check for Paper Champion badge (5 attempts)
      const attemptCount = await pool.query(
        `SELECT COUNT(*) FROM past_paper_attempts WHERE student_id = $1`,
        [studentId]
      );
      if (Number(attemptCount.rows[0].count) >= 5) {
        await awardXPAndCheckBadges(studentId, req.user!.schoolId, "paper_champion", 0);
      }

      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to record attempt" });
    }
  }
);

// GET /api/pastpapers/:id/attempts — get attempts for a paper (teacher view)
router.get("/:id/attempts", authorize("teacher", "principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT ppa.*, s.name as student_name, s.adm_no, s.class
       FROM past_paper_attempts ppa JOIN students s ON s.id = ppa.student_id
       WHERE ppa.paper_id = $1
       ORDER BY ppa.attempted_at DESC`,
      [req.params.id]
    );
    res.json({ attempts: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
});

export default router;
