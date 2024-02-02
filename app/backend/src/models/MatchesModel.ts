import { ServiceMessage, ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatches } from '../Interfaces/matches/IMatches';
import SequelizeMatches from '../database/models/SequelizeMatches';
import Teams from '../database/models/SequelizeTeams';
import { IMatchesModel } from '../Interfaces/matches/IMatchesModel';
import { scoreboardType } from '../Interfaces/matches/IMatchesResponse';

export default class MatchesModel implements IMatchesModel {
  private model = SequelizeMatches;
  private teamModel = Teams;

  async findAll(): Promise<IMatches[]> {
    const dbResponse = await this.model.findAll({
      include: [
        {
          model: Teams,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: Teams,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
      attributes: { exclude: ['home_team_id', 'away_team_id'] },
    });

    return dbResponse;
  }

  async getFilteredMatches(progress: boolean): Promise<IMatches[]> {
    const filteredMatches = await this.model.findAll({
      where: { inProgress: progress },
      include: [
        {
          model: Teams,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: Teams,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
      attributes: { exclude: ['home_team_id', 'away_team_id'] },
    });

    return filteredMatches;
  }

  async finishMatch(idMatch: number): Promise<ServiceMessage> {
    const match = await this.model.findByPk(idMatch);

    if (match) {
      await this.model
        .update({ inProgress: false }, { where: { id: idMatch } });

      return { message: 'Finished' };
    }
    return { message: 'Failed' };
  }

  async updateMatchGoals(
    id: number,
    scoreboard: scoreboardType,
  ): Promise<IMatches | void> {
    const match = await this.model.findByPk(id);
    const { homeTeamGoals, awayTeamGoals } = scoreboard;

    if (match) {
      await this.model
        .update(
          { homeTeamGoals, awayTeamGoals },
          { where: { id } },
        );
      return match;
    }
  }

  async createMatch(matchInfos: IMatches): Promise<ServiceResponse<IMatches | ServiceMessage>> {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = matchInfos;

    const verifyTeam1 = await this.model.findOne({ where: { homeTeamId } });
    const verifyTeam2 = await this.model.findOne({ where: { awayTeamId } });

    if (!verifyTeam1 || !verifyTeam2) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }

    const newMatch = await this.model.create(
      { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress: true },
    );

    return { status: 'CREATED', data: newMatch };
  }
}
