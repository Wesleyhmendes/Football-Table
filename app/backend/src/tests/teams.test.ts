import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeTeams from '../database/models/SequelizeTeams';
import { teams, team } from './mocks/Teams.mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams tests', () => {
  beforeEach(function() {
    sinon.restore()
  });

  it('Should return a team', async function() {
    sinon.stub(SequelizeTeams, 'findAll').resolves(teams as any);

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(teams);
  });

  it('Should return a team by id', async function() {
    sinon.stub(SequelizeTeams, 'findByPk').resolves(team as any);

    const { status, body } = await chai.request(app).get('/teams/5');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(team);
  });

  it('Should return an error when the team is not found', async function() {
    sinon.stub(SequelizeTeams, 'findByPk').resolves();

    const { status, body } = await chai.request(app).get('/teams/500');

    expect(status).to.equal(404);
    expect(body).to.deep.equal({ message: 'Team not found' });
  });
});
