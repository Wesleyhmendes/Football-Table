import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import leaderboardMocks from './mocks/leaderboard.mocks';


chai.use(chaiHttp);

const { expect } = chai;
const {
  generalLeaderboard,
  homeFilteredLeaderboard,
  awayFilteredLeaderboard,
} = leaderboardMocks;

describe('Leaderboard tests', () => {
  beforeEach(function() {
    sinon.restore()
  });
  it('Should return the leaderboard of home matches', async function() {
    const { status, body } = await chai.request(app).get('/leaderboard/home');

    console.log('este é o body: ', body);

    expect(status).to.equal(200);
    expect(body).to.deep.equal(homeFilteredLeaderboard);
  });

  it('Should return the leaderboard of away matches', async function() {
    const { status, body } = await chai.request(app).get('/leaderboard/away');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(awayFilteredLeaderboard);
  });

  it('Should return the complete leaderboard', async function() {
    const { status, body } = await chai.request(app).get('/leaderboard');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(generalLeaderboard);
  });

  it('should map status to HTTP code', () => {
    const successfulStatus = 'SUCCESSFUL';
    const invalidDataStatus = 'INVALID_DATA';
    const notFoundStatus = 'NOT_FOUND';
    const conflictStatus = 'CONFLICT';
    const unauthorizedStatus = 'UNAUTHORIZED';
    const createdStatus = 'CREATED';
    const unknownStatus = 'UNKNOWN_STATUS';

    expect(mapStatusHTTP(successfulStatus)).to.equal(200);
    expect(mapStatusHTTP(invalidDataStatus)).to.equal(400);
    expect(mapStatusHTTP(notFoundStatus)).to.equal(404);
    expect(mapStatusHTTP(conflictStatus)).to.equal(409);
    expect(mapStatusHTTP(unauthorizedStatus)).to.equal(401);
    expect(mapStatusHTTP(createdStatus)).to.equal(201);
    expect(mapStatusHTTP(unknownStatus)).to.equal(500);
  });
});