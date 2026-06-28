import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { query } from "../config/db";

const router = Router();
router.use(authenticate);

router.get("/", authorize("principal", "teacher", "parent"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      "SELECT id, name, adm_no, class, nemis_no, dob, gender FROM students WHERE school_id = $1 ORDER BY name",
      [req.user!.schoolId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

router.get("/:id", authorize("principal", "teacher", "parent"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      "SELECT s.*, c.competencies FROM students s LEFT JOIN cbc_competencies c ON c.student_id = s.id WHERE s.id = $1 AND s.school_id = $2",
      [req.params.id, req.user!.schoolId]
    );
    if (!result.rows[0]) { res.status(404).json({ error: "Student not found" }); return; }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

router.post("/", authorize("principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, admNo, class: cls, nemisNo, dob, gender } = req.body;
  try {
    const result = await query(
      "INSERT INTO students (name, adm_no, class, nemis_no, dob, gender, school_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [name, admNo, cls, nemisNo, dob, gender, req.user!.schoolId]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to create student" });
  }
});

router.put("/:id", authorize("principal", "teacher"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, class: cls } = req.body;
  try {
    const result = await query(
      "UPDATE students SET name=$1, class=$2, updated_at=NOW() WHERE id=$3 AND school_id=$4 RETURNING *",
      [name, cls, req.params.id, req.user!.schoolId]
    );
    if (!result.rows[0]) { res.status(404).json({ error: "Student not found" }); return; }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to update student" });
  }
});

router.delete("/:id", authorize("principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await query("DELETE FROM students WHERE id=$1 AND school_id=$2", [req.params.id, req.user!.schoolId]);
    res.json({ message: "Student deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

export default router;
