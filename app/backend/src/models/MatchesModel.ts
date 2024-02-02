import { ServiceMessage, ServiceResponse } from '../Interfaces/ServiceResponse';
import { IMatches } from '../Interfaces/matches/IMatches';
import SequelizeMatches from '../database/models/SequelizeMatches';
import Teams from '../database/models/SequelizeTeams';
import { IMatchesModel } from '../Interfaces/matches/IMatchesModel';
import { scoreboardType } from '../Interfaces/matches/IMatchesResponse';

type TeamLeaderboardParams = 'homeTeam' | 'awayTeam';
type TeamLeaderboardParams2 = 'homeTeamGoals' | 'awayTeamGoals';

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

  async formattedTeams() {
    const allMatches = await this.getFilteredMatches(false) as (SequelizeMatches & {
      homeTeam: { teamName: string }; awayTeam: { teamName: string }
    })[];

    const allTeams = await this.teamModel.findAll({ attributes: { exclude: ['id'] } });

    const teams = allTeams.map(({ teamName }) => ({
      name: teamName,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    }));

    return { teams, allMatches };
  }

  async getLeaderboardPoints(teamName: TeamLeaderboardParams, teamGoal: TeamLeaderboardParams2) {
    const { allMatches, teams: newTeams } = await this.formattedTeams();

    const updatedTeams = newTeams.map((newTeam) => {
      const team = { ...newTeam };

      const matches = allMatches.filter((match) => match[teamName].teamName === team.name);

      let wins; let losses;

      if (teamName === 'homeTeam') {
        wins = matches.filter((match) => match[teamGoal] > match.awayTeamGoals).length;
        losses = matches.filter((match) => match[teamGoal] < match.awayTeamGoals).length;
      } else {
        wins = matches.filter((match) => match[teamGoal] > match.homeTeamGoals).length;
        losses = matches.filter((match) => match[teamGoal] < match.homeTeamGoals).length;
      }

      const draws = matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;

      team.totalPoints += (3 * wins) + draws; team.totalGames += matches.length;
      team.totalVictories += wins; team.totalDraws += draws; team.totalLosses += losses;

      return team;
    });
    return updatedTeams;
  }

  async getLeaderboardGoals(teamN: TeamLeaderboardParams, teamGoal: TeamLeaderboardParams2) {
    const teams = await this.getLeaderboardPoints(teamN, teamGoal);
    const { allMatches } = await this.formattedTeams();

    const response = teams.map((singleTeam) => {
      const team = { ...singleTeam };

      const goals = allMatches.filter((m) => m[teamN].teamName === team.name).reduce((acc, crr) => {
        if (teamN === 'homeTeam') {
          acc.goalsFavor += crr.homeTeamGoals; acc.goalsOwn += crr.awayTeamGoals;
        } else {
          acc.goalsFavor += crr.awayTeamGoals; acc.goalsOwn += crr.homeTeamGoals;
        }
        return acc;
      }, { goalsFavor: 0, goalsOwn: 0 });

      team.goalsFavor += goals.goalsFavor; team.goalsOwn += goals.goalsOwn;
      team.goalsBalance += team.goalsFavor - team.goalsOwn;
      team.efficiency += Number(((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2));

      return team;
    });

    return response;
  }

  async getOrderedLeaderboard(teamName: TeamLeaderboardParams, teamGoal: TeamLeaderboardParams2) {
    const leaderboard = await this.getLeaderboardGoals(teamName, teamGoal);

    const orderedLeaderboard = leaderboard.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }

      if (b.goalsBalance !== a.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }

      return b.goalsFavor - a.goalsFavor;
    });

    return orderedLeaderboard;
  }
}
