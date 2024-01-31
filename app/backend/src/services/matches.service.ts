import { ServiceResponse } from '../Interfaces/ServiceResponse';
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
}
