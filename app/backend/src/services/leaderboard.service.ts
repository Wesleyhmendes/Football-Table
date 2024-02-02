import LeaderboardModel from '../models/LeaderboardModel';

export default class MatchesService {
  constructor(
    private leaderboardModel = new LeaderboardModel(),
  ) { }

  public async getLeaderBoardHome() {
    const leaderBoard = await this
      .leaderboardModel.getOrderedLeaderboard('homeTeam', 'homeTeamGoals');

    return { status: 'SUCCESSFUL', data: leaderBoard };
  }

  public async getLeaderBoardAway() {
    const leaderBoard = await this
      .leaderboardModel.getOrderedLeaderboard('awayTeam', 'awayTeamGoals');

    return { status: 'SUCCESSFUL', data: leaderBoard };
  }

  async getGeneralLeaderboard() {
    const leaderBoard = await this.leaderboardModel.getGeneralLeaderboard();

    const orderedLeaderboard = leaderBoard.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }

      if (b.goalsBalance !== a.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }

      return b.goalsFavor - a.goalsFavor;
    });

    return { status: 'SUCCESSFUL', data: orderedLeaderboard };
  }
}
