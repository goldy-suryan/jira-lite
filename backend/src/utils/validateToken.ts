import jwt from 'jsonwebtoken';

export function authenticateToken(token: string) {
  const secret = process.env.JWT_SECRET as string;
  if (token) {
    const user = jwt.verify(token, secret);
    return user;
  }
  return null;
}
