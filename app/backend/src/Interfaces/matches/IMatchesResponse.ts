interface serviceMessageResponse {
  message: string,
}

type scoreboardType = {
  homeTeamGoals: number,
  awayTeamGoals: number,
};

export { serviceMessageResponse, scoreboardType };
