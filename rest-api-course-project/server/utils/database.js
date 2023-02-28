const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/rest_blog';

const mongooseConnect = async (app, port) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.set('strictQuery', true);

    const server = app.listen(port, () => {
      console.log(`Server listening... http://localhost:${port}`);
    });

    /**
     * Establishing websocket connection with
     * socket.io. It uses the http server to establish
     * this connection
     * The package exposes a function which requires
     * the Node.js server as it's parameter. The function
     * returns a `socket.io` object which has set up all
     * the websocket stuff behind the scenes for us
    */
    const io = require('../socket').init(server);

    /**
     * With the `socket.io` object at out disposal, we
     * can use it to listen to events to run desired
     * logics. In the below example we are listening to
     * the `connection` event which is triggered for any
     * new client that connects
     * NOTE: The handler function which is added to the 
     * `connection` event implicitly receives the `socket`
     * as it's parameter (i.e the client connection)
    */

    io.on('connection', socket => {
      console.log('Client connected: ');
    });

    return server;
  } catch (error) {
    console.log(`An error occurred while connecting to Mongodb: ${error.message}`);
  }
};

module.exports = mongooseConnect;
