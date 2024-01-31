import { Model, QueryInterface, DataTypes } from 'sequelize';
import { IMatches } from '../../Interfaces/matches/IMatches';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<IMatches>>('matches', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      homeTeamId: {
        type: DataTypes.NUMBER,
        field: 'home_team_id',
        references: {
          model: 'teams',
          key: 'id',
        }
      },
      homeTeamGoals: {
        type: DataTypes.NUMBER,
        field: 'home_team_goals',
        allowNull: false,
      },
      awayTeamId: {
        type: DataTypes.NUMBER,
        field: 'away_team_id',
        references: {
          model: 'teams',
          key: 'id',
        }
      },
      awayTeamGoals: {
        type: DataTypes.NUMBER,
        field: 'away_team_goals',
        allowNull: false,
      },
      inProgress: {
        type: DataTypes.BOOLEAN,
        field: 'in_progress',
        allowNull: false,
      }
    })
  }
}