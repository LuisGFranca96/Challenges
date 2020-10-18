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
      models.User.hasOne(models.Beta_subscription)
      models.User.hasMany(models.Notification)
      models.User.hasMany(models.Users_tool)
      models.User.hasMany(models.Users_notification)
      models.User.hasMany(models.Approved_user_tool)
      models.User.hasOne(models.Subscription)
      models.User.belongsTo(models.Occupation)
    }

    static passwordMatches(password, modelPassword) {
      return bcrypt.compare(password, modelPassword)
    }

    static sign(user) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          isAuthor: user.isAuthor,
          isCompany: user.isCompany,
          isBetaUser: user.isBetaUser,
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
    dtbirth: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    linkedin_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isWhatsapp: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    fb_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twitter_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isBetaUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isAuthor: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isCompany: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    termsOfUse: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    privacyPolicy: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};