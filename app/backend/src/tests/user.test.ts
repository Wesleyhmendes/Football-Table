import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import * as bcrypt from 'bcryptjs';
import SequelizeUser from '../database/models/SequelizeUsers';
import { 
  user, token, simpleUser, noEmailUser, noPasswordUser, invalidEmailUser, shortPasswordUser,
  noExistingMessageError, invalidEmailMessageError, invalidPasswordUser
} from './mocks/User.mocks';
import Validations from '../middlewares/validations';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('User Tests', () => {
  it('Should return a token', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(user as any);
    sinon.stub(Validations, 'validateLogin').returns();

    const { status, body } = await chai.request(app)
    .post('/login')
    .send(simpleUser);

    expect(status).to.equal(200);
    expect(body).to.have.key('token');
  });

  it('Should return an error when an email is not sent', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves();
    sinon.stub(Validations, 'validateLogin').resolves(noExistingMessageError);

    const { status, body } = await chai.request(app)
    .post('/login')
    .send(noEmailUser);

    expect(status).to.equal(400);
    expect(body).to.deep.equal(noExistingMessageError);
  });

  it('Should return an error when a password is not sent', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves();
    sinon.stub(Validations, 'validateLogin').resolves(noExistingMessageError);

    const { status, body } = await chai.request(app)
    .post('/login')
    .send(noPasswordUser);

    expect(status).to.equal(400);
    expect(body).to.deep.equal(noExistingMessageError);
  });

  it('Should return an error when an invalid email is sent', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves();
    sinon.stub(Validations, 'validateLogin').resolves(invalidEmailMessageError);

    const { status, body } = await chai.request(app)
    .post('/login')
    .send(invalidEmailUser);

    expect(status).to.equal(400);
    expect(body).to.deep.equal(invalidEmailMessageError);
  });

  it('Should return an error when a too short password is sent', async function() {
    sinon.stub(Validations, 'validateLogin').resolves({ message: 'Invalid email or password' });

    const { status, body } = await chai.request(app)
    .post('/login')
    .send(shortPasswordUser);

    expect(status).to.equal(400);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('Should return an error when the user is not found', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves();
    sinon.stub(Validations, 'validateLogin').resolves();

    const { status, body } = await chai.request(app)
    .post('/login')
    .send(simpleUser);

    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('Should return an error when the password is not valid', async function() {
    sinon.stub(bcrypt, 'compare').resolves(false);

    const { status, body } = await chai.request(app)
    .post('/login')
    .send(invalidPasswordUser);

    expect(status).to.equal(401);
    expect(body).to.deep.equal({ message: 'Invalid email or password' });
  });

  afterEach(sinon.restore);
});
