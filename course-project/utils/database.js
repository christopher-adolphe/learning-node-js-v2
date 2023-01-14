const mongoose = require('mongoose');
// const uri = "mongodb+srv://online-shop-admin:kqOt3IBqrR3IbQkZ@christopher-db.vztrg.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017/online_shop";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
  } catch(error) {
    console.log(`An error occurred while connecting to Mongodb: ${error}`);
  }
};

module.exports = mongooseConnect;
