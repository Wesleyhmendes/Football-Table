import { ILogin } from './ILogin';

export interface ILoginModel {
  findOne(email: string): Promise<ILogin | null>,
}
