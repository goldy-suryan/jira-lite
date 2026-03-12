import { Router } from 'express';
import { UserController } from './user.controller.js';

export class UserRoute {
  router: Router;
  private readonly userCtl = new UserController();

  constructor() {
    this.router = Router();
    this.initializeUserRoutes();
  }

  initializeUserRoutes() {
    this.router.post('/register', this.userCtl.register);
    this.router.post('/login', this.userCtl.login);
    this.router.post('/logout', this.userCtl.logout);
  }
}
