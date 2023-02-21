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

    return server;
  } catch (error) {
    console.log(`An error occurred while connecting to Mongodb: ${error.message}`);
  }
};

module.exports = mongooseConnect;
