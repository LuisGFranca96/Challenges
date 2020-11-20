import { Joi } from 'express-validation'

export default {
    // POST /api/users
    createUser: {
        body: Joi.object({
          email: Joi.string().required(),
      }),
    },

    // UPDATE /api/users/:userId
    updateUser: {
      body: Joi.object({
        lastName: Joi.string(),
        firstName: Joi.string(),
        phone: Joi.string(),
        photo: Joi.string().allow(null),
      }),
      params: Joi.object({
        userId: Joi.string().hex().required(),
      }),
  },

    // UPDATE /api/users/change-password/:userId
    changePassword: {
        body: Joi.object({
          oldPassword: Joi.string().required(),
          newPassword: Joi.string().required(),
          repeatPassword: Joi.string().required(),
          sure: Joi.boolean().required()
      }),
        params: Joi.object({
          userId: Joi.string().hex().required(),
      }),
    },

    // POST /api/users/confirm-account/:key
    confirmAccount: {
        body: Joi.object({
            confirmed: Joi.boolean().required()
        }),
        params: Joi.object({
            key: Joi.string().required(),
        }),
    },

    // POST /api/auth/login
    login: {
        body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        }),
    },

    // POST /api/auth/askResetPassword
    askResetPassword: {
        body: Joi.object({
            email: Joi.string().required()
        }),
    },

    // POST /api/auth/resetPassword
    resetPassword: {
        body: Joi.object({
            key: Joi.string().required()
        }),
    },

    // POST /api/auth/postResetPassword
    postResetPassword: {
        body: Joi.object({
            password: Joi.string().required(),
            repeatPassword: Joi.string().required()
        }),
    }
};
