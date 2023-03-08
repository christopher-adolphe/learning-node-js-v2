const jwt = require('jsonwebtoken');

const authenticate = (request, response, next) => {
  try {
    /**
     * Retrieving the token sent in the request headers by
     * the client by using the `get()` method on the request
     * object and passing the name of the header as parameter
    */
    const authHeader = request.get('Authorization');

    if (!authHeader) {
      request.isAuth = false;

      return next();
    }
    
    const token = authHeader.split(' ')[1];
    let decodedToken;
    /**
     * Using the `verify()` method from the jwt to decode the
     * token sent by the client. This method takes the token as
     * 1st parameter and the secret key as the second parameter
    */
    decodedToken = jwt.verify(token, 'myJwtSecretPrivateKey');

    if (!decodedToken) {
      request.isAuth = false;

      return next();
    }

    request.userId = decodedToken.userId;
    request.isAuth = true;

    next();
  } catch (error) {
    request.isAuth = false;

    return next();
  }
};

module.exports = authenticate;
