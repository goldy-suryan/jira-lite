import type { NextFunction, Request, Response } from 'express';
import { AiService } from './ai.service.js';

export class AiController {
  private readonly aiSrvc = new AiService();

  generateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.aiSrvc.generateTask(req.body);
      return res.status(200).json({ message: 'success', data });
    } catch (e) {
      next(e);
    }
  };
}
