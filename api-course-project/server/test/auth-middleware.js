const expect = require('chai').expect;

const authenticate = require('../middleware/auth');

it('should throw an error given request does not contain authorization header set', () => {
  const request = {
    get() {
      return null;
    },
  };

  expect(authenticate.bind(this, request, {}, () => {})).to.throw('Sorry, user is not authenticated');
});
