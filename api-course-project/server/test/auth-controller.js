const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const { signUp, signIn, getStatus, updateStatus } = require('../controllers/auth-controller');

describe('Auth controller #signIn', () => {
  it('should throw an error with statusCode 500 given that the database cannot be accessed', async () => {
    const request = {
      body: {
        email: 'john.joe@gmail.com',
        password: 'someFakePassword',
      },
    };

    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const response = await signIn(request, {}, () => {});

    expect(response).to.be.an('error');
    expect(response).to.have.property('statusCode', 500);

    User.findOne.restore();
  });
});
