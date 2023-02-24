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
      const error = new Error('Sorry, user is not authenticated');

      error.statusCode = 401;

      throw error;
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
      const error = new Error('Sorry, user is not authenticated');

      error.statusCode = 401;

      throw error;
    }

    request.userId = decodedToken.userId;

    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

module.exports = authenticate;
