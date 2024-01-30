import SequelizeLogin from '../database/models/SequelizeUsers';
import { ILoginModel } from '../Interfaces/login/ILoginModel';
import { ILogin } from '../Interfaces/login/ILogin';

export default class LoginModel implements ILoginModel {
  private model = SequelizeLogin;

  async findOne(email: string): Promise<ILogin | null> {
    const dbResponse = await this.model.findOne({ where: { email } });

    if (!dbResponse) return null;

    return dbResponse;
  }
}
