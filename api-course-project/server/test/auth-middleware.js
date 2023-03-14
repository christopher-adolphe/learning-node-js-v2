const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const authenticate = require('../middleware/auth');

describe('#auth middleware', () => {
  it('should throw an error given request does not contain authorization header set', () => {
    const request = {
      get: function() {
        return null;
      },
    };
  
    expect(authenticate.bind(this, request, {}, () => {})).to.throw('Sorry, user is not authenticated');
  });
  
  it('should thrown an error given authorization header contain only one string', () => {
    const request = {
      get: function() {
        return 'Bearer';
      },
    };
  
    expect(authenticate.bind(this, request, {}, () => {})).to.throw('jwt must be provided');
  });

  it('should throw an error given the token cannot be verified', () => {
    const request = {
      get: function() {
        return 'Bearer someFakeToken';
      },
    };
  
    expect(authenticate.bind(this, request, {}, () => {})).to.throw('jwt malformed');
  });

  it('shoudl set a #userId property to the request given the toke is decoded', () => {
    const request = {
      get: function() {
        return 'Bearer someFakeToken';
      },
    };

    /**
     * Manually stubing the `verify()` method from
     * the jwt package to replace the original implementation
     * of the method
    */
    // jwt.verify = function() {
    //   return { userId: 'someFakeUserId852963147' };
    // }

    /**
     * Using the `stub()` method from the sinon package
     * to stub the `verify()` method
    */
    sinon.stub(jwt, 'verify');

    /**
     * Sinon replaces the original `verify()` method with an
     * object that we can then configure to specify what it
     * should return for the scenario under test
    */
    jwt.verify.returns({ userId: 'someFakeUserId852963147' });

    authenticate(request, {}, () => {});

    expect(jwt.verify.called).to.be.true;
    expect(request).to.have.property('userId');

    /**
     * Calling the `restore()` method on the stubbed function
     * to restore the original jwt `verify`
    */
    jwt.verify.restore();
  });
});
