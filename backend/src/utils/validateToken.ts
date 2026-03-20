import jwt from 'jsonwebtoken';

export function authenticateToken(token: string) {
  const secret = process.env.JWT_SECRET as string;
  if (!token) return null;

  try {
    const user = jwt.verify(token, secret);
    return user;
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return null;
    }
    throw err;
  }
}
