import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { query } from "../config/db";

const router = Router();
router.use(authenticate);

router.get("/", authorize("principal", "parent"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT f.*, s.name AS student_name, s.class
       FROM fees f JOIN students s ON s.id = f.student_id
       WHERE s.school_id = $1 ORDER BY f.created_at DESC LIMIT 100`,
      [req.user!.schoolId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch fees" });
  }
});

router.get("/summary", authorize("principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT
         SUM(expected_amount) AS total_expected,
         SUM(paid_amount) AS total_collected,
         COUNT(*) FILTER (WHERE paid_amount >= expected_amount) AS fully_paid,
         COUNT(*) FILTER (WHERE paid_amount = 0) AS unpaid
       FROM fees f JOIN students s ON s.id = f.student_id
       WHERE s.school_id = $1 AND f.term = $2 AND f.year = $3`,
      [req.user!.schoolId, req.query.term || "2", req.query.year || new Date().getFullYear()]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch fee summary" });
  }
});

router.post("/record", authorize("principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { studentId, amount, term, year, mpesaRef } = req.body;
  try {
    const result = await query(
      `INSERT INTO fee_payments (student_id, amount, term, year, mpesa_ref, recorded_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [studentId, amount, term, year, mpesaRef, req.user!.id]
    );
    await query(
      "UPDATE fees SET paid_amount = paid_amount + $1 WHERE student_id = $2 AND term = $3 AND year = $4",
      [amount, studentId, term, year]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to record payment" });
  }
});

export default router;
