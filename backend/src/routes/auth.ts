import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db";

const router = Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  try {
    const result = await query(
      "SELECT id, email, password_hash, role, school_id, name FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, schoolId: user.school_id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, schoolId } = req.body;
  if (!name || !email || !password || !role || !schoolId) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      "INSERT INTO users (name, email, password_hash, role, school_id) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role",
      [name, email, passwordHash, role, schoolId]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
