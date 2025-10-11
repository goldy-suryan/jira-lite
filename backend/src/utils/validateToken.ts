import jwt from 'jsonwebtoken';

export function authenticateToken(authHeader: string) {
  const secret = process.env.JWT_SECRET as string;
  if (authHeader?.includes('Bearer')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      const user = jwt.verify(token, secret);
      return user;
    }
  }
  return null;
}
