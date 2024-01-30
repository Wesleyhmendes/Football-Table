import { Request, Router, Response } from 'express';
import LoginController from '../controllers/login.controller';
import Validations from '../middlewares/validations';

const loginController = new LoginController();

const router = Router();

router.get(
  '/',
  Validations.validateLogin,
  (req: Request, res: Response) => loginController.login(req, res),
);

export default router;
