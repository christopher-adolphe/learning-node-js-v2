const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');

module.exports = {
  createUser: async function({ userInputData }, req) {
    const { name, email, password } = userInputData;
    const errors = [];

    if (!validator.isEmail(email)) {
      errors.push({ message: 'Please enter a valid email!' });
    }

    if (!validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
      errors.push({ message: 'Please enter a password of minimum 5 charactors!' });
    }

    try {
      if (error.isLength > 0) {
        const error = new Error(('Invalid input'));

        throw error;
      }
      
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
