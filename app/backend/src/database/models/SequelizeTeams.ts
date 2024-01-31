import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import Matches from './SequelizeMatches';
import db from '.';

class SequelizeTeams extends Model<InferAttributes<SequelizeTeams>,
InferCreationAttributes<SequelizeTeams>> {
  declare id: CreationOptional<number>;

  declare teamName: string;
}

SequelizeTeams.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
  underscored: true,
});

SequelizeTeams.hasMany(Matches, { foreignKey: 'home_team_id' });
SequelizeTeams.hasMany(Matches, { foreignKey: 'away_team_id' });

Matches.belongsTo(SequelizeTeams, { foreignKey: 'home_team_id' });
Matches.belongsTo(SequelizeTeams, { foreignKey: 'away_team_id' });

export default SequelizeTeams;
