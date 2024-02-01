import { serviceMessageResponse, scoreboardType } from '../Interfaces/matches/IMatchesResponse';
import { ServiceMessage, ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatches } from '../Interfaces/matches/IMatches';
import MatchesModel from '../models/MatchesModel';

export default class MatchesService {
  constructor(
    private matchesModel = new MatchesModel(),
  ) { }

  public async getAllMatches(): Promise<ServiceResponse<IMatches[]>> {
    const matches = await this.matchesModel.findAll();

    return { status: 'SUCCESSFUL', data: matches };
  }

  public async getFilteredMatches(
    progress: boolean,
  ): Promise<ServiceResponse<IMatches[]>> {
    const filteredMatches = await this.matchesModel.getFilteredMatches(progress);

    return { status: 'SUCCESSFUL', data: filteredMatches };
  }

  public async updateMatchProgress(id: number): Promise<ServiceResponse<serviceMessageResponse>> {
    const update = await this.matchesModel.updateMatchProgress(id);

    if (update.message === 'Finished') {
      return { status: 'SUCCESSFUL', data: update };
    }

    return { status: 'INVALID_DATA', data: update };
  }

  public async updateMatchGoals(
    id: number,
    scoreboard: scoreboardType,
  ): Promise<ServiceResponse<IMatches | ServiceMessage>> {
    const match = await this.matchesModel.updateMatchGoals(id, scoreboard);

    if (match) {
      return { status: 'SUCCESSFUL', data: match };
    }

    return { status: 'INVALID_DATA', data: { message: 'Match not found' } };
  }

  public async createMatch(
    matchInfos: IMatches,
  ): Promise<ServiceResponse<IMatches | ServiceMessage>> {
    const newMatch = await this.matchesModel.createMatch(matchInfos);

    return newMatch;
  }
}
