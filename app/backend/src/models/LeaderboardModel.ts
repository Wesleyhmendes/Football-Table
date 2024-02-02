import SequelizeMatches from '../database/models/SequelizeMatches';
import MatchesModel from './MatchesModel';
import Teams from '../database/models/SequelizeTeams';

import {
  TeamLeaderboardParams,
  TeamLeaderboardParams2,
} from '../Interfaces/leaderboard/leaderboardParams';

export default class LeaderboardModel {
  private teamModel = Teams;
  private matchesModel = new MatchesModel();

  async formattedTeams() {
    const allMatches = await this.matchesModel.getFilteredMatches(false) as (SequelizeMatches & {
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

  async getGeneralLeaderboard() {
    const homeLeaderboard = await this.getLeaderboardGoals('homeTeam', 'homeTeamGoals');
    const awayLeaderboard = await this.getLeaderboardGoals('awayTeam', 'awayTeamGoals');

    const response = homeLeaderboard.map((iterableTeam) => {
      const home = { ...iterableTeam };
      awayLeaderboard.filter((away) => home.name === away.name)
        .forEach((away) => {
          home.totalPoints += away.totalVictories * 3 + away.totalDraws;
          home.totalGames += away.totalGames;
          home.totalVictories += away.totalVictories; home.totalLosses += away.totalLosses;
          home.totalDraws += away.totalDraws;
          home.goalsFavor += away.goalsFavor;
          home.goalsOwn += away.goalsOwn; home.goalsBalance += away.goalsBalance;

          home.efficiency = Number(((home.totalPoints / (home.totalGames * 3)) * 100).toFixed(2));
        });
      return home;
    });
    return response;
  }
}
