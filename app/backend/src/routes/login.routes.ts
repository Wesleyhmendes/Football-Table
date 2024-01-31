import { Request, Router, Response } from 'express';
import LoginController from '../controllers/login.controller';
import Validations from '../middlewares/validations';

const loginController = new LoginController();

const router = Router();

router.post(
  '/',
  Validations.validateLogin,
  (req: Request, res: Response) => loginController.login(req, res),
);

router.get(
  '/role',
  Validations.auth,
  (_req: Request, res: Response) => res.status(200).json({ role: res.locals.auth.role }),
);
export default router;
