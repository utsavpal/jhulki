import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: String;
  email: String;
  role: String;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

export function signToken(payload: { userId: string; email: string; role: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  // Resolved outside the try: a missing JWT_SECRET is a server misconfiguration and must
  // surface, not be swallowed into a null that reads as an ordinary invalid token.
  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret) as { userId: string; email: string; role: string };
  } catch (err) {
    return null;
  }
}
