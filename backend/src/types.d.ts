export {};

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'User' | 'Viewer';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
