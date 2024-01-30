import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export default class AuthValidation {
  static auth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return res.status(400).json({ message: 'Token not found' });
    }

    const [type, token] = req.headers.authorization.split(' ');

    if (type !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid type of token' });
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
