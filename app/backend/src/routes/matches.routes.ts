import { Request, Router, Response } from 'express';
import MatchesController from '../controllers/matches.controller';
import Validations from '../middlewares/validations';

const matchesController = new MatchesController();

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => matchesController.getMatches(req, res),
);

router.post(
  '/',
  Validations.auth,
  (req: Request, res: Response) => matchesController.createMatch(req, res),
);

router.patch(
  '/:id/finish',
  Validations.auth,
  (req: Request, res: Response) => matchesController.updateMatchProgress(req, res),
);

router.patch(
  '/:id',
  Validations.auth,
  (req: Request, res: Response) => matchesController.updateMatchGoals(req, res),
);

export default router;
