const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://online-shop-admin:kqOt3IBqrR3IbQkZ@christopher-db.vztrg.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let _db;

const mongoConnect = async (serverCallback) => {
  try {
    const mongoClient = await MongoClient.connect(uri);
    console.log('Connected to Mongodb');
    _db = await mongoClient.db();

    serverCallback();
  } catch(error) {
    console.log(`An error occurred while connecting to Mongodb: ${error}`);
  }
};

const getDatabase = () => {
  if (_db) {
    return _db;
  }

  throw new Error('Sorry, no database found');
};

module.exports = {
  mongoConnect,
  getDatabase
};
