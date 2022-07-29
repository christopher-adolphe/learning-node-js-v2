const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

/**
 * Using the `define()` method of the sequelize 
 * instance to define the attributes of the Product
 * model.
 * A model is an abstraction that represents a table
 * in a database.
 */
const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Product;
