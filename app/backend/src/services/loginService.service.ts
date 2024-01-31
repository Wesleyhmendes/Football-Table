import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import LoginModel from '../models/LoginModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

type LoginResponse = {
  token: string
};

export default class LoginService {
  constructor(
    private loginModel = new LoginModel(),
  ) { }

  public async login(email: string, password: string): Promise<ServiceResponse<LoginResponse>> {
    const user = await this.loginModel.findOne(email);

    if (!user) return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const payload = { sub: user.id, role: 'user', email: user.email };
    const secret = process.env.JWT_SECRET ?? 'jwt_secret';

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    return { status: 'SUCCESSFUL', data: { token } };
  }
}
