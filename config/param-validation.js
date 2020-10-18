import Joi from 'joi';

export default {
    // POST /api/users
    createUser: {
        body: {
            email: Joi.string().required(),
        },
    },

    // UPDATE /api/users/:userId
    updateUser: {
        body: {
          lastName: Joi.string(),
          firstName: Joi.string(),
          phone: Joi.string(),
          photo: Joi.string().allow(null),
        },
        params: {
          userId: Joi.string().hex().required(),
        },
    },

    // UPDATE /api/users/change-password/:userId
    changePassword: {
        body: {
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
            repeatPassword: Joi.string().required(),
            sure: Joi.boolean().required()
        },
        params: {
            userId: Joi.string().hex().required(),
        },
    },

    // POST /api/users/confirm-account/:key
    confirmAccount: {
        body: {
            confirmed: Joi.boolean().required()
        },
        params: {
            key: Joi.string().required(),
        },
    },

    // POST /api/auth/login
    login: {
        body: {
            email: Joi.string().required(),
            password: Joi.string().required(),
        },
    },

    // POST /api/auth/askResetPassword
    askResetPassword: {
        body: {
            email: Joi.string().required()
        },
    },

    // POST /api/auth/resetPassword
    resetPassword: {
        body: {
            key: Joi.string().required()
        },
    },

    // POST /api/auth/postResetPassword
    postResetPassword: {
        body: {
            password: Joi.string().required(),
            repeatPassword: Joi.string().required()
        },
    }
};
