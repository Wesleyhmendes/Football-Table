import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchesService from '../services/matches.service';

export default class MatchesController {
  constructor(
    private matchesService = new MatchesService(),
  ) { }

  public async getMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress) {
      const progress = inProgress === 'true';
      const serviceResponse = await this.matchesService.getFilteredMatches(progress);

      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    const serviceResponse = await this.matchesService.getAllMatches();

    res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }

  public async updateMatchProgress(req: Request, res: Response) {
    const { id } = req.params;

    const { status, data } = await this.matchesService.updateMatchProgress(Number(id));

    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async updateMatchGoals(req: Request, res: Response) {
    const { id } = req.params;
    const scoreboard = req.body;

    const { status, data } = await this.matchesService.updateMatchGoals(Number(id), scoreboard);

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
