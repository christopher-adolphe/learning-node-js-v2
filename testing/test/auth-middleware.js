const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');

it('should throw an error given request does not contain authorization header set', function() {
  const request = {
    get: function() {
      return null;
    },
  };

  expect(() => authMiddleware(request, {}, () => {})).to.throw('Not authenticated.');
});
