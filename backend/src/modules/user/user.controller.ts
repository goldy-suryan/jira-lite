import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from './user.service.js';

export class UserController {
  private readonly userSrvc = new UserService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      if (!email || !password) {
        throw new Error('email and password is required');
      }
      await this.userSrvc.createUser(name, email, password);
      res.status(201).json({ message: 'Registered successfully' });
    } catch (e: any) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error('email and password is required');
      }
      const foundUser = await this.userSrvc.getUser(email, password);
      const { id, role, name } = foundUser;
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT SECRET not defined');
      }
      const token = jwt.sign({ id, name, email, role }, jwtSecret, {
        expiresIn: '3d',
      });

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax', // none
        path: '/',
        // secure: true // when sameSite is none
      });

      return res.status(200).json({
        message: 'Success',
        data: {
          id,
          name,
          email,
          role,
        },
      });
    } catch (e) {
      next(e);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      });
      res.status(200).json({ message: 'logout successfully' });
    } catch (e) {
      next(e);
    }
  };
}
