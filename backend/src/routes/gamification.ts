import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import pool from "../config/db";

const router = Router();
router.use(authenticate);

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];

function calcLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, LEVEL_THRESHOLDS.length);
}

// GET /api/gamification/me — current user's XP, level, streak, badges
router.get("/me", async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  try {
    const xpResult = await pool.query(
      `SELECT total_xp, streak_days, last_active_date, level FROM user_xp WHERE user_id = $1`,
      [userId]
    );
    const badgesResult = await pool.query(
      `SELECT b.name, b.icon, b.description, ub.earned_at
       FROM user_badges ub JOIN badges b ON b.id = ub.badge_id
       WHERE ub.user_id = $1 ORDER BY ub.earned_at DESC`,
      [userId]
    );
    const recentXP = await pool.query(
      `SELECT action, xp_earned, created_at FROM xp_transactions
       WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );

    const xp = xpResult.rows[0] || { total_xp: 0, streak_days: 0, level: 1 };
    const currentLevel = calcLevel(Number(xp.total_xp));
    const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const prevThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;

    res.json({
      totalXp: Number(xp.total_xp),
      streakDays: Number(xp.streak_days),
      level: currentLevel,
      levelProgress: Math.round(((Number(xp.total_xp) - prevThreshold) / (nextThreshold - prevThreshold)) * 100),
      nextLevelXp: nextThreshold,
      badges: badgesResult.rows,
      recentActivity: recentXP.rows,
    });
  } catch (err) {
    console.error("Gamification me error:", err);
    res.status(500).json({ error: "Failed to fetch gamification data" });
  }
});

// GET /api/gamification/leaderboard — school leaderboard
router.get("/leaderboard", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  const { limit = 20 } = req.query as { limit?: string };

  try {
    const result = await pool.query(
      `SELECT u.name, ux.total_xp, ux.streak_days, ux.level,
              COUNT(ub.id) as badge_count,
              RANK() OVER (ORDER BY ux.total_xp DESC) as rank
       FROM user_xp ux
       JOIN users u ON u.id = ux.user_id
       LEFT JOIN user_badges ub ON ub.user_id = ux.user_id
       WHERE ux.school_id = $1
       GROUP BY u.name, ux.total_xp, ux.streak_days, ux.level
       ORDER BY ux.total_xp DESC LIMIT $2`,
      [schoolId, Number(limit)]
    );
    res.json({ leaderboard: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// GET /api/gamification/badges — all available badges
router.get("/badges", async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`SELECT * FROM badges ORDER BY xp_required ASC`);
    res.json({ badges: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch badges" });
  }
});

// POST /api/gamification/award-xp — award XP for an action (internal, teacher/principal)
router.post(
  "/award-xp",
  authorize("teacher", "principal"),
  [
    body("userId").isUUID(),
    body("action").notEmpty().isString(),
    body("xp").isInt({ min: 1, max: 500 }),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userId, action, xp } = req.body as { userId: string; action: string; xp: number };
    const schoolId = req.user!.schoolId;

    try {
      await awardXPAndCheckBadges(userId, schoolId, action, xp);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to award XP" });
    }
  }
);

// POST /api/gamification/streak — update daily streak
router.post("/streak", async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const schoolId = req.user!.schoolId;

  try {
    const existing = await pool.query(
      `SELECT last_active_date, streak_days FROM user_xp WHERE user_id = $1`,
      [userId]
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO user_xp (user_id, school_id, total_xp, streak_days, last_active_date)
         VALUES ($1, $2, 10, 1, CURRENT_DATE)`,
        [userId, schoolId]
      );
      res.json({ streakDays: 1, xpAwarded: 10 });
      return;
    }

    const lastActive = existing.rows[0].last_active_date;
    const lastDate = new Date(lastActive);
    lastDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      res.json({ streakDays: existing.rows[0].streak_days, xpAwarded: 0, message: "Already logged today" });
      return;
    }

    const newStreak = diffDays === 1 ? Number(existing.rows[0].streak_days) + 1 : 1;
    const xpBonus = newStreak % 7 === 0 ? 50 : 10;

    await pool.query(
      `UPDATE user_xp SET streak_days = $1, last_active_date = CURRENT_DATE,
       total_xp = total_xp + $2, updated_at = NOW() WHERE user_id = $3`,
      [newStreak, xpBonus, userId]
    );
    await pool.query(
      `INSERT INTO xp_transactions (user_id, action, xp_earned) VALUES ($1, $2, $3)`,
      [userId, "daily_streak", xpBonus]
    );

    if (newStreak === 7 || newStreak === 30) {
      await checkAndAwardBadge(userId, "7-Day Streak");
    }

    res.json({ streakDays: newStreak, xpAwarded: xpBonus });
  } catch (err) {
    console.error("Streak error:", err);
    res.status(500).json({ error: "Failed to update streak" });
  }
});

export async function awardXPAndCheckBadges(userId: string, schoolId: string, action: string, xp: number) {
  await pool.query(
    `INSERT INTO user_xp (user_id, school_id, total_xp, last_active_date)
     VALUES ($1, $2, $3, CURRENT_DATE)
     ON CONFLICT (user_id) DO UPDATE SET
       total_xp = user_xp.total_xp + $3,
       level = $4,
       last_active_date = CURRENT_DATE,
       updated_at = NOW()`,
    [userId, schoolId, xp, calcLevel(xp)]
  );
  await pool.query(
    `INSERT INTO xp_transactions (user_id, action, xp_earned) VALUES ($1, $2, $3)`,
    [userId, action, xp]
  );

  const xpResult = await pool.query(`SELECT total_xp FROM user_xp WHERE user_id = $1`, [userId]);
  const totalXp = Number(xpResult.rows[0]?.total_xp || 0);

  const milestones = [
    { xp: 50, name: "First Steps" },
    { xp: 300, name: "Rising Scholar" },
    { xp: 1000, name: "Dedicated Learner" },
    { xp: 2000, name: "Elite Scholar" },
  ];
  for (const m of milestones) {
    if (totalXp >= m.xp) await checkAndAwardBadge(userId, m.name);
  }
}

async function checkAndAwardBadge(userId: string, badgeName: string) {
  try {
    const badge = await pool.query(`SELECT id FROM badges WHERE name = $1`, [badgeName]);
    if (!badge.rows[0]) return;
    await pool.query(
      `INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, badge.rows[0].id]
    );
  } catch (err) {
    console.error("Badge award error:", err);
  }
}

export default router;
