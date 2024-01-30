import { ITeams } from '../Interfaces/teams/ITeams';
import TeamModel from '../models/TeamsModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class TeamService {
  constructor(
    private teamModel = new TeamModel(),
  ) { }

  public async getAllTeams(): Promise<ServiceResponse<ITeams[]>> {
    const allTeams = await this.teamModel.findAll();

    return { status: 'SUCCESSFUL', data: allTeams };
  }

  public async getTeamById(id: number): Promise<ServiceResponse<ITeams>> {
    const team = await this.teamModel.findByPk(id);

    if (!team) return { status: 'NOT_FOUND', data: { message: 'Team not found' } };

    return { status: 'SUCCESSFUL', data: team };
  }
}
