import { Request, Router, Response } from 'express';
import MatchesController from '../controllers/matches.controller';

const matchesController = new MatchesController();

const router = Router();

router.get(
  '/home',
  (req: Request, res: Response) => matchesController.getLeaderBoard(req, res),
);

export default router;
