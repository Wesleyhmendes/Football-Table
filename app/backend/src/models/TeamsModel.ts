import { ITeams } from '../Interfaces/teams/ITeams';
import SequelizeTeams from '../database/models/SequelizeTeams';
import { ITeamsModel } from '../Interfaces/teams/ITeamsModel';

export default class TeamsModel implements ITeamsModel {
  private model = SequelizeTeams;

  async findAll(): Promise<ITeams[]> {
    const dbResponse = await this.model.findAll();

    return dbResponse;
  }

  async findByPk(id: number): Promise<ITeams | null> {
    const dbResponse = await this.model.findByPk(id);

    if (!dbResponse) {
      return null;
    }

    return dbResponse;
  }
}
