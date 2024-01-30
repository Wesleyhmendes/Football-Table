import { Request, Response, NextFunction } from 'express';

export default class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) return res.status(400).json({ message: 'email missing' });
    if (!password) return res.status(400).json({ message: 'password missing' });

    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters' });
    }

    if (!regexEmail.test(email)) {
      return res.status(400).json({ message: 'You must use a valid email' });
    }

    next();
  }
}
