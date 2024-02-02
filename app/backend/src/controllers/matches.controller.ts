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

    const { status, data } = await this.matchesService.getAllMatches();

    res.status(mapStatusHTTP(status)).json(data);
  }

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;

    const { status, data } = await this.matchesService.finishMatch(Number(id));

    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async updateMatchGoals(req: Request, res: Response) {
    const { id } = req.params;
    const scoreboard = req.body;

    const { status, data } = await this.matchesService.updateMatchGoals(Number(id), scoreboard);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async createMatch(req: Request, res: Response) {
    const matchInfo = req.body;

    const { status, data } = await this.matchesService.createMatch(matchInfo);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async getLeaderBoard(req: Request, res: Response) {
    const { status, data } = await this.matchesService.getLeaderBoard();

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
