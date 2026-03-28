import { Router } from "express";
import { AiController } from "./ai.controller.js";

export class AiRoute {
  router: Router;
  private readonly aiCtrl = new AiController();

  constructor() {
    this.router = Router();
    this.initializedRoute();
  }

  private initializedRoute() {
    this.router.post('/generate-task', this.aiCtrl.generateTask);
  }
}