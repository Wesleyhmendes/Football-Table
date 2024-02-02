import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import LeaderboardService from '../services/leaderboard.service';

export default class MatchesController {
  constructor(
    private leaderboardService = new LeaderboardService(),
  ) { }

  public async getLeaderBoardHome(req: Request, res: Response) {
    const { status, data } = await this.leaderboardService.getLeaderBoardHome();

    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async getLeaderBoardAway(req: Request, res: Response) {
    const { status, data } = await this.leaderboardService.getLeaderBoardAway();

    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async getGeneralLeaderboard(req: Request, res: Response) {
    const { status, data } = await this.leaderboardService.getGeneralLeaderboard();

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
