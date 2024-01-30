import { ITeams } from './ITeams';

export interface ITeamsModel {
  findAll(): Promise<ITeams[]>,
  findByPk(id: number): Promise<ITeams | null>,
}
