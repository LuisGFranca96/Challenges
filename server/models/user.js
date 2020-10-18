'use strict';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../../config/vars";
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }

    static passwordMatches(password, modelPassword) {
      return bcrypt.compare(password, modelPassword)
    }

    static sign(user) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          expiresIn: 3600 * 2
        },
        config.jwtSecret
      );
      
      return token;
    }

    static async passwordHash(password) {
      const hash = await bcrypt.hash(password, config.env === 'development' ? 1 : 10)

      return hash;
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};