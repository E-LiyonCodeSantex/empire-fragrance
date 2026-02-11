import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Request to include user
export interface AuthRequest extends Request {
  user: { id: string; role?: string } & JwtPayload;
}

// ✅ Registration validation middleware
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { userName, email, password, confirmPassword, termsAccepted } = req.body;

  if (!userName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }
  if (!termsAccepted) {
    return res.status(400).json({ message: "Terms must be accepted." });
  }
  next();
};

// ✅ Auth middleware: verifies JWT
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "This page requires you to  login." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role?: string } & JwtPayload;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers.authorization; 
   if (!authHeader) { 
    // no token → guest 
    return next();
   } 
   
   const token = authHeader.split(" ")[1]; 
   try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any; 
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
   } catch (err) {
     // invalid token → treat as guest 
     console.warn("Invalid token, continuing as guest"); 
    } 
    next(); 
  };

// ✅ Role-based middleware: requires admin
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied for users: Admins only" });
  }
  next();
};

