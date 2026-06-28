import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { query } from "../config/db";

const router = Router();
router.use(authenticate);

router.get("/", authorize("principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      "SELECT id, name, role, subjects, class, tsc_no, status FROM staff WHERE school_id = $1 ORDER BY name",
      [req.user!.schoolId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

router.post("/", authorize("principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, role, subjects, cls, tscNo } = req.body;
  try {
    const result = await query(
      "INSERT INTO staff (name, role, subjects, class, tsc_no, status, school_id) VALUES ($1,$2,$3,$4,$5,'present',$6) RETURNING *",
      [name, role, subjects, cls, tscNo, req.user!.schoolId]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to create staff member" });
  }
});

router.patch("/:id/status", authorize("principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  if (!["present", "absent", "leave"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  try {
    const result = await query(
      "UPDATE staff SET status=$1, updated_at=NOW() WHERE id=$2 AND school_id=$3 RETURNING *",
      [status, req.params.id, req.user!.schoolId]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
