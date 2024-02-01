const match = {
  id: 1,
  homeTeamId: 16,
  homeTeamGoals: 2,
  awayTeamId: 8,
  awayTeamGoals: 2,
  inProgress: true
}

const match2 = {
  id: 2,
  homeTeamId: 8,
  homeTeamGoals: 2,
  awayTeamId: 8,
  awayTeamGoals: 2,
  inProgress: true
}

const newMatchBody = {
  "homeTeamId": 16,
  "awayTeamId": 8,
  "homeTeamGoals": 2,
  "awayTeamGoals": 2
}

const invalidNewMatchBody = {
  "homeTeamId": 8,
  "awayTeamId": 8,
  "homeTeamGoals": 2,
  "awayTeamGoals": 2
}

const invalidNewMatchBody2 = {
  "homeTeamId": 8,
  "awayTeamId": 8,
  "homeTeamGoals": 2,
  "awayTeamGoals": 2
}

const newMatch = {
	"id": 1,
	"homeTeamId": 16,
	"homeTeamGoals": 2,
	"awayTeamId": 8,
	"awayTeamGoals": 2,
	"inProgress": true
}

const matchToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNzA2NjY0NzI4LCJleHAiOjE3MDcyNjk1Mjh9.5-jAnVmwyxIjePkikTh-aBRIZV2lvwZcYG9QNbI1DLo"

const updateMatch = {
  "homeTeamGoals": 3,
  "awayTeamGoals": 1
}

const finishMatchMessage = { "message": "Finished" }

const matchInProgress = [
  {
    "id": 41,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 9,
    "awayTeamGoals": 0,
    "inProgress": true,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Internacional"
    }
  },
  {
    "id": 42,
    "homeTeamId": 6,
    "homeTeamGoals": 1,
    "awayTeamId": 1,
    "awayTeamGoals": 0,
    "inProgress": true,
    "homeTeam": {
      "teamName": "Ferroviária"
    },
    "awayTeam": {
      "teamName": "Avaí/Kindermann"
    }
  }
]

const matchesFinished = [
  {
    "id": 41,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 9,
    "awayTeamGoals": 0,
    "inProgress": false,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Internacional"
    }
  },
  {
    "id": 42,
    "homeTeamId": 6,
    "homeTeamGoals": 1,
    "awayTeamId": 1,
    "awayTeamGoals": 0,
    "inProgress": false,
    "homeTeam": {
      "teamName": "Ferroviária"
    },
    "awayTeam": {
      "teamName": "Avaí/Kindermann"
    }
  }
]

const allMatches = [
  {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 1,
    "awayTeamId": 8,
    "awayTeamGoals": 1,
    "inProgress": false,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Grêmio"
    }
  },
  {
    "id": 41,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 9,
    "awayTeamGoals": 0,
    "inProgress": true,
    "homeTeam": {
      "teamName": "São Paulo"
    },
    "awayTeam": {
      "teamName": "Internacional"
    }
  }
]

export default {
  match,
  updateMatch,
  finishMatchMessage,
  matchInProgress,
  matchesFinished,
  allMatches,
  matchToken,
  match2,
  newMatch,
  newMatchBody,
  invalidNewMatchBody,
  invalidNewMatchBody2,
}