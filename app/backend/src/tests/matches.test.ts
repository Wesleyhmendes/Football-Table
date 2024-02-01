import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeMatches from '../database/models/SequelizeMatches';
import matchMocks from './mocks/Matches.mocks';
import AuthValidation from '../middlewares/validations';

import { Response } from 'superagent';
import { token } from './mocks/User.mocks';

chai.use(chaiHttp);

const { expect } = chai;
const { 
  match,
  match2,
  updateMatch,
  newMatch,
  newMatchBody,
  finishMatchMessage,
  matchInProgress,
  matchesFinished,
  allMatches,
  matchToken,
  invalidNewMatchBody,
 } = matchMocks;

describe('Matches tests', () => {
  beforeEach(() => {
    sinon.stub(AuthValidation, 'auth').resolves(() => {});
  });

  it('Should return all matches', async function() {
    sinon.stub(SequelizeMatches, 'findAll').resolves(allMatches as any);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(allMatches);
  });

  it('Should return all matches in progress', async function() {
    sinon.stub(SequelizeMatches, 'findAll').resolves(matchInProgress as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=true');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matchInProgress);
  });

  it('Should return all finished matches', async function() {
    sinon.stub(SequelizeMatches, 'findAll').resolves(matchesFinished as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=false');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matchesFinished);
  });

  it('Should finish a match', async function() {
    sinon.stub(SequelizeMatches, 'findByPk').resolves(match as any);
    sinon.stub(SequelizeMatches, 'update').resolves(undefined);

    const { status, body } = await chai.request(app)
    .patch('/matches/1/finish')
    .set('Authorization', matchToken);

    expect(status).to.equal(200);
    expect(body).to.deep.equal(finishMatchMessage);
  });

  it('Should request for a token when user tries to finish a match', async function() {
    sinon.stub(SequelizeMatches, 'findByPk').resolves(match as any);
    sinon.stub(SequelizeMatches, 'update').resolves(undefined);

    const { status, body } = await chai.request(app)
    .patch('/matches/1/finish');

    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Token not found' });
  });

  it('Should update a match scoreboard', async function() {
    sinon.stub(SequelizeMatches, 'findByPk').resolves(match as any);
    sinon.stub(SequelizeMatches, 'update').resolves(undefined);

    const { status, body } = await chai.request(app)
    .patch('/matches/1')
    .set('Authorization', matchToken);

    expect(status).to.equal(200);
    expect(body).to.deep.equal(match);
  });

  it('Should create a match', async function() {
    sinon.stub(SequelizeMatches, 'create').resolves(newMatch as any);

    sinon.stub(SequelizeMatches, 'update').resolves(undefined);

    const { status, body } = await chai.request(app)
    .post('/matches')
    .send(newMatchBody)
    .set('Authorization', matchToken);

    expect(body).to.deep.equal(match);
    expect(status).to.equal(201);
  });

  it('Should return an error when user tries to create a match with two equal teams', async function() {
    const { status, body } = await chai.request(app)
    .post('/matches')
    .send(invalidNewMatchBody)
    .set('Authorization', matchToken);

    expect(status).to.equal(422);
    expect(body).to.deep.equal({ "message": "It is not possible to create a match with two equal teams" });
  });

  it('Should return an error when user tries to create a match with an invalid team', async function() {
    const { status, body } = await chai.request(app)
    .post('/matches')
    .send(invalidNewMatchBody)
    .set('Authorization', matchToken);

    expect(status).to.equal(422);
    expect(body).to.deep.equal({ "message": "It is not possible to create a match with two equal teams" });
  });

  afterEach(sinon.restore);
});
