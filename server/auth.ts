import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'university_placement_portal_jwt_secret_key_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'student' | 'admin' | 'recruiter';
  name: string;
}

// Extend Express Request
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Hashes a plaintext password securely using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plaintext password with bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Signs a JWT authentication token
 */
export function generateAuthToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies JWT token
 */
export function verifyAuthToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Authentication Middleware: Extracts & validates JWT from Authorization header
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return res.status(403).json({ error: 'Invalid or expired authentication token' });
  }

  req.user = payload;
  next();
}

/**
 * Role-Based Authorization Guard (e.g. requires 'admin')
 */
export function requireRole(allowedRoles: ('student' | 'admin' | 'recruiter')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Requires role in [${allowedRoles.join(', ')}]`,
      });
    }
    next();
  };
}
