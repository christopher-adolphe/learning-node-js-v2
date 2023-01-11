const mongodb = require('mongodb');
const { getDatabase } = require('../utils/database');

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  async save() {
    const db = getDatabase();

    try {
      const users = await db.collection('users');
      const result = await users.insertOne(this);

      return result;
    } catch (error) {
      console.log(`Sorry, an error occurred while saving user: ${error}`);
    }
  }

  static async findById(userId) {
    const db = getDatabase();

    try {
      const user = await db
        .collection('users')
        .find({ _id: new mongodb.ObjectId(userId) })
        .next();

      return user;
    } catch (error) {
      console.log(`Sorry, an error occurred while fetching user with id ${userId}: ${error}`);
    }
  }
}

module.exports = User;
