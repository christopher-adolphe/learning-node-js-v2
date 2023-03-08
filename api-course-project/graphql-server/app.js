const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');

const mongooseConnect = require('./utils/database');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const authenticate = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 8080;

const fileStorage = multer.diskStorage({
  destination: (request, file, doneCallback) => {
    doneCallback(null, 'images');
  },
  filename: (request, file, doneCallback) => {
    doneCallback(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (request, file, doneCallback) => {
  const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

  if (allowedFileTypes.includes(file.mimetype)) {
    doneCallback(null, true);
  } else {
    doneCallback(null, false);
  }
};

/**
 * Adding the `bodyParser` middleware to our
 * express application so that it parse json
 * data from incoming requests
*/
app.use(bodyParser.json());

app.use(multer({
  storage: fileStorage,
  fileFilter,
}).single('image'));

/**
 * Adding the built-in Express `static` middleware
 * to indicate our express application which directories
 * we want to serve statically
*/
app.use('/images', express.static(path.join(__dirname, 'images')))

/**
 * Addding a middleware to our express application
 * to enable Cross-Origin-Resource-Sharing (CORS)
 * to that clients hosted on other servers can still
 * accept responses from our express application
*/
app.use((request, response, next) => {
  /**
   * Specifying which origins can accept responses from
   * our express application
   * NOTE: With `*` as value, this means that the responses
   * from the express application can accepted by client
  */
  response.setHeader('Access-Control-Allow-Origin', '*');

  /**
   * Specifying which http methods the client can use
   * our express application
  */
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');

  /**
   * Specifying some extra headers that the client can send
   * with their requests to our express application
  */
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.sendStatus(200);
  }

  next();
});

app.use(authenticate);

/**
 * Creating a REST endpoint to handle image uploads
*/
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);

  fs.unlink(filePath, error => console.log('An error occurred while deleting uploaded file'));
};

app.put('/post-image', (request, response, next) => {
  const { isAuth } = request;
  const { oldImagePath } = request.body;

  if (!isAuth) {
    throw new Error('Sorry, cannot upload files while not being authenticated');
  }

  if (!request.file) {
    return response.status(200).json({ message: 'No file provided' });
  }

  if (oldImagePath) {
    clearImage(oldImagePath);
  }

  return response.status(201).json({
    message: 'File uploaded successfully',
    filePath: request.file.path,
  });
});

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  customFormatErrorFn(error) {
    if (!error.orignalError) {
      return error;
    }

    const data = error.orignalError.data;
    const message = error.message || 'An error occurred.';
    const code = error.orignalError.code || 500;

    return { message, data, status: code };
  },
}));

/**
 * Setting up a catch all error middleware
*/
app.use((error, request, response, next) => {
  const { statusCode, message, info } = error;

  response.status(statusCode).json({ message, info });
});

mongooseConnect(app, port);
