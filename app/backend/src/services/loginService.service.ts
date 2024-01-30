import { ILogin } from '../Interfaces/login/ILogin';
import LoginModel from '../models/LoginModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class LoginService {
  constructor(
    private loginModel = new LoginModel(),
  ) { }

  public async login(email: string, _password: string): Promise<ServiceResponse<ILogin>> {
    const user = await this.loginModel.findOne(email);

    if (!user) return { status: 'NOT_FOUND', data: { message: 'User not found' } };

    return { status: 'SUCCESSFUL', data: user };
  }
}
