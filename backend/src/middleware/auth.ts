import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; schoolId: string };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  // Support Bearer header (standard) and ?token= query param (for SSE EventSource)
  const headerToken = req.headers.authorization?.split(" ")[1];
  const queryToken = typeof req.query.token === "string" ? req.query.token : undefined;
  const token = headerToken || queryToken;

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    next();
  };
}
