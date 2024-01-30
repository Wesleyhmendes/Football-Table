import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeTeams from '../database/models/SequelizeTeams';
import { teams, team } from './mocks/Teams.mocks';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Seu teste', () => {
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
});
