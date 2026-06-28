import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { query } from "../config/db";

const router = Router();
router.use(authenticate);

router.get("/today", authorize("principal", "teacher"), async (req: AuthRequest, res: Response): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const result = await query(
      `SELECT a.*, s.name, s.class FROM attendance a
       JOIN students s ON s.id = a.student_id
       WHERE s.school_id = $1 AND a.date = $2 ORDER BY s.class, s.name`,
      [req.user!.schoolId, today]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

router.post("/mark", authorize("principal", "teacher"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { records } = req.body as { records: { studentId: string; status: string }[] };
  const today = new Date().toISOString().split("T")[0];
  try {
    for (const rec of records) {
      await query(
        `INSERT INTO attendance (student_id, date, status, marked_by)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (student_id, date) DO UPDATE SET status = $3, marked_by = $4`,
        [rec.studentId, today, rec.status, req.user!.id]
      );
    }
    res.json({ message: `${records.length} records saved` });
  } catch {
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

router.get("/stats/:studentId", authorize("principal", "teacher", "parent"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT
         COUNT(*) AS total_days,
         COUNT(*) FILTER (WHERE status = 'present') AS present_days,
         ROUND(COUNT(*) FILTER (WHERE status = 'present') * 100.0 / NULLIF(COUNT(*), 0), 1) AS percentage
       FROM attendance a JOIN students s ON s.id = a.student_id
       WHERE a.student_id = $1 AND s.school_id = $2`,
      [req.params.studentId, req.user!.schoolId]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch attendance stats" });
  }
});

export default router;
