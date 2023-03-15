const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const { signIn, getStatus } = require('../controllers/auth-controller');

describe('Auth controller', () => {
  before(async () => {
    mongoose.connect('mongodb://localhost:27017/test_rest_blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = new User({
      _id: '63ff5446fcb96f29f6832e97',
      email: 'john.doe@gmail.com',
      password: 'someFakePassword',
      name: 'John Doe',
      posts: [],
    });

    await user.save();
  });

  after(async () => {
    User.deleteMany();
    await mongoose.disconnect();
  });

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

  it('should send a response with the user status given a valid existing userId', async () => {
    const request = {
      userId: '63ff5446fcb96f29f6832e97',
    };
    const response = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;

        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      },
    };
    
    const responseData = await getStatus(request, response, () => {});
    console.log('responseData: ', responseData);

    expect(responseData.statusCode).to.be.equal(200);
    expect(responseData.status).to.be.equal('I am new');
  });
});
