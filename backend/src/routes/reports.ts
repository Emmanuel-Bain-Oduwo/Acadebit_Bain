import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { query } from "../config/db";

const router = Router();
router.use(authenticate);

// NEMIS-format learner export
router.get("/nemis", authorize("principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT nemis_no, name, dob, gender, class, adm_no FROM students
       WHERE school_id = $1 ORDER BY class, name`,
      [req.user!.schoolId]
    );
    res.json({ format: "NEMIS", term: req.query.term, year: req.query.year, records: result.rows });
  } catch {
    res.status(500).json({ error: "Failed to generate NEMIS report" });
  }
});

// CBC competency summary per class
router.get("/cbc", authorize("principal", "teacher"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT s.class, c.subject, c.competency_code, COUNT(*) AS count
       FROM cbc_competencies c JOIN students s ON s.id = c.student_id
       WHERE s.school_id = $1 GROUP BY s.class, c.subject, c.competency_code ORDER BY s.class, c.subject`,
      [req.user!.schoolId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to generate CBC report" });
  }
});

// Fee collection summary
router.get("/fees", authorize("principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT s.class,
         SUM(f.expected_amount) AS expected,
         SUM(f.paid_amount) AS collected,
         ROUND(SUM(f.paid_amount)*100.0/NULLIF(SUM(f.expected_amount),0),1) AS rate
       FROM fees f JOIN students s ON s.id = f.student_id
       WHERE s.school_id = $1 AND f.term = $2 AND f.year = $3
       GROUP BY s.class ORDER BY s.class`,
      [req.user!.schoolId, req.query.term || "2", req.query.year || new Date().getFullYear()]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to generate fee report" });
  }
});

export default router;
