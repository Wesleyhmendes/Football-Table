import { Request, Response, NextFunction } from 'express';

export default class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) return res.status(400).json({ message: 'All fields must be filled' });

    if (!regexEmail.test(email) || password.length < 6) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    next();
  }
}
