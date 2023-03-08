let io;

const init = (httpServer) => {
  io = require('socket.io')(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    }
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Sorry, websock is not established');
  }

  return io;
};

module.exports = {
  init,
  getIO,
};
