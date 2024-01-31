import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export default class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) return res.status(400).json({ message: 'All fields must be filled' });

    if (!regexEmail.test(email) || password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    next();
  }

  static auth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const [type, token] = req.headers.authorization.split(' ');

    if (type !== 'Bearer') {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    try {
      const secret = process.env.JWT_SECRET ?? 'jwt_secret';
      const payload = jwt.verify(token, secret);
      res.locals.auth = payload;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
    next();
  }
}
