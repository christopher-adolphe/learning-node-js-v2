const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = {
  createUser: async function({ userInputData }, req) {
    const { name, email, password } = userInputData;

    try {
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        const error = new Error(`Sorry, a user with email ${email} already exists`);

        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      const result = await user.save();

      return {
        ...result._doc,
        _id: result._id.toString(),
      };
    } catch (error) {
      console.log(error)
    }
  }
};
