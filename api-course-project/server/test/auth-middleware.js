const expect = require('chai').expect;

const authenticate = require('../middleware/auth');

it('should throw an error given request does not contain authorization header set', function() {
  const request = {
    get: function() {
      return null;
    },
  };

  expect(authenticate.bind(this, request, {}, () => {})).to.throw('Sorry, user is not authenticated');
});