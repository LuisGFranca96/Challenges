import httpStatus from 'http-status';
import crypto from "crypto-js";
import db from '../models';
import APIError from '../helpers/APIError';
import { Op } from 'sequelize';

const { User, Occupation, Subscription, Plan, sequelize } = db;

/**
 * Load user and append to req.
 */
const load = async (req, res, next, id) => {
    try {
        const user = await User.findOne({where: {id}})

        if (!user) {
            throw new APIError("Este usuário não existe.");
        }

        req.foundUser = user; // eslint-disable-line no-param-reassign
        
        return next();
    } catch(err) {
        return res.status(err.status ? err.status : 500).json({
            success: false,
            message: err.message,
            status: err.status ? err.status : 500
        })
    }
}

/**
 * Get user
 * @returns {User}
 */
const get = async (req, res) => {
    const { userId } = req.params;
    const { user } = req;

    try {
        if ((user.id != userId) && !user.isAdmin) {
            throw new APIError("Não é possível visualizar um usuário diferente do seu.");
        }

        const userFound = await User.findOne({
            where: {
                id: userId
            },
            attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'isWhatsapp', 'isBetaUser', 'isCompany', 'fb_url', 'linkedin_url', 'twitter_url', 'OccupationId', 'active', 'confirmed', 'photo'],
            include: [{model: Occupation}]
        })

        if (!userFound) {
            throw new APIError("Usuário não encontrado.");
        }

        const subscriptionFound = await Subscription.findOne({
          where: {
            UserId: userFound.id
          },
          include: [{model: Plan}]
        })

        if (!subscriptionFound) {
          throw new APIError("Inscrição do usuário não encontrada.");
        }

        return res.json({
            user: userFound,
            subscription: subscriptionFound,
            success: true
        });
    } catch (err) {
        return res.status(err.status ? err.status : 500).json({
            message: err.message,
            success: false,
            status: err.status ? err.status : 500
        });
    }
}

/**
 * Create new user
 * @returns {User}
 */
const create = async (req, res, next) => {
    const { firstName, lastName, password, repeatPassword, phone, email } = req.body;

    const t = await sequelize.transaction();
    try {
        if (password !== repeatPassword) {
            throw new APIError("As senhas não coincidem.");
        }

        const passwordHashed = await User.passwordHash(password);
        const key = crypto.MD5(email + new Date());

        const newUser = await User.create({
            firstName,
            lastName,
            password: passwordHashed,
            key: key.toString(),
            confirmed: false,
            phone,
            email,
            active: true,
            photo: null
        }, { transaction: t });

        if (!newUser) {
            throw new APIError("Houve um erro ao criar o usuário.");
        }

        await t.commit();

        return res.json({
            success: true,
            message: 'Usuário criado com sucesso!'
        })
    } catch (err) {
        await t.rollback();
        return res.status(err.status ? err.status : 500).json({
            message: err.message,
            success: false,
            status: err.status ? err.status : 500
        });
    }
}

/**
 * Update existing user
 * @returns {User}
 */
const update = async (req, res, next) => {
    const { user, body } = req;
    const { userId } = req.params;

    const u = await sequelize.transaction();
    try {
        if (userId != user.id) {
          throw new APIError("Você não possui permissão para atualizar usuário."); 
        }

        const userFound = await User.findByPk(userId);

        const updatedUser = await userFound.update({
          lastName: body.lastName,
          firstName: body.firstName,
          phone: body.phone,
          photo: body.photo
        }, {transaction: u});

        if (!updatedUser) {
            throw new APIError("Houve um erro ao atualizar o usuário.");
        }

        u.commit();

        return res.json({
            success: true,
            message: "Usuário atualizado com sucesso!"
        });
    } catch (err) {
        u.rollback();
        return res.status(err.status ? err.status : 500).json({
            message: err.message,
            success: false,
            status: err.status ? err.status : 500
        });
    }
}

/**
 * Update password of existing user
 * @param {oldPassword, newPassword, repeatPassword, sure} req 
 * @param {object} res 
 * @returns {User}
 */
const changePassword = async (req, res) => {
    const { user } = req;
    const { oldPassword, newPassword, repeatPassword, sure } = req.body;
    const { userId } = req.params;

    const t = await sequelize.transaction();
    try {
        if (userId != user.id) {
            throw new APIError("Você não possui permissão para atualizar usuário.");
        }

        if (!sure) {
            throw new APIError("Para trocar a sua senha, é necessário confirmar a ação.");
        }

        if (newPassword !== repeatPassword) {
            throw new APIError("As novas senhas não coincidem.");
        }

        // const passwordHashed = User.passwordHash(oldPassword);

        const userFound = await User.findByPk(user.id);

        if (!userFound) {
            throw new APIError("Este usuário não existe.");
        }
        
        if (!(await User.passwordMatches(oldPassword, userFound.password))) {
            throw new APIError("A sua senha atual é inválida.");
        }

        const body = {
            password: await User.passwordHash(newPassword)
        }

        const updatedUser = await userFound.update(body, {transaction: t});

        if (!updatedUser) {
            throw new APIError("Houve um erro ao atualizar o usuário.");
        }

        await t.commit();

        return res.json({
            success: true,
            message: "Senha atualizada com sucesso!"
        });
    } catch (err) {
        await t.rollback();
        return res.status(err.status ? err.status : 500).json({
            message: err.message,
            success: false,
            status: err.status ? err.status : 500
        });
    }
}

/**
 * Get user list.
 * @returns {User[]}
 */
const list = async (req, res, next) => {
    const { limit = 20, page = 1 } = req.query;
    const {user} = req;
    const offset = 0 + (parseInt(page) - 1) * limit;

    try {
        if (!user.isAdmin) {
            throw new APIError("Não foi possível acessar este local.");
        }

        const users = await User.findAndCountAll({
            include: [
                {model: Occupation}
            ],
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'photo', 'confirmed', 'active'],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        if (!users) {
            throw new APIError("Não foi possível trazer a lista de usuários");
        }

        return res.json({
            success: true,
            users: users.rows,
            pagination: {
                limit,
                offset,
                page: parseInt(page),
                count: users.count,
                nextPage: offset + limit <= users.count
            }
        })
    } catch(err) {
        return res.status(err.status ? err.status : 500).json({
            success: false,
            message: err.message
        })
    }
}

/**
 * Get user by name
 */
const fetchUser = async (req, res, next) => {
  const {user} = req;
  const { search } = req.query;

  try {
    if (!user.isAdmin) {
        throw new APIError("Não foi possível acessar este local.");
    }

    let where = {}

    if (!!search) {
      where = {...where,
        firstName: {
          [Op.iLike]: `%${search}%`
        },
        lastName: {
          [Op.iLike]: `%${search}%`
        }
      }
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'firstName', 'lastName', 'photo', 'active'],
      order: [['createdAt', 'DESC']]
    });

    if (!users) {
      throw new APIError("Não foi possível trazer a lista de usuários");
    }

    return res.json({
        success: true,
        users: users
    })

  } catch(err) {
    return res.status(err.status ? err.status : 500).json({
        success: false,
        message: err.message
    })
  }
}

/**
 * Account confirmation
 */
const confirmAccount = async (req, res, next) => {
    const { confirmed } = req.body;
    const { key } = req.params;

    const t = await sequelize.transaction();
    try {
        if (!confirmed) {
            throw new APIError("Sua conta não foi confirmada.");
        }

        if (!key) {
            throw new APIError("Não foi possível identificar a chave de confirmação");
        }

        const userFound = await User.findOne({
            where: {
                key
            },
            attributes: ['id', 'key', 'confirmed']
        });

        if (!userFound) {
            throw new APIError("Não foi possível identificar o usuário.");
        }

        const userUpdated = await userFound.update({
            confirmed,
            key: null
        }, { transaction: t });

        if (!userUpdated) {
            throw new APIError("Não foi possível confirmar sua conta.");
        }

        await t.commit();

        return res.json({
            success: true,
            message: "Usuário confirmado com sucesso!"
        })
    } catch (err) {
        t.rollback();
        return res.status(err.status ? err.status : 500).json({
            message: err.message,
            success: false,
            status: err.status ? err.status : 500
        })
    }
}

const createUserImageUpload = async (req, res, next) => {
    const { file, user, foundUser } = req;
    const { userId } = req.params;

    const t = await sequelize.transaction();
    try {
        if (user.id != userId) {
            throw new APIError("Você não tem permissão para adicionar foto de usuário.", httpStatus.UNAUTHORIZED);
        }

        const updatedUser = await foundUser.update({
            photo: req.protocol + '://' + req.get('host') + '/static/users/' + file.filename
        }, { transaction: t });

        if (!updatedUser) {
            throw new APIError("Houve um erro ao atualizar a foto do usuário.");
        }

        t.commit();

        return res.json({
            status: true,
            message: 'Imagem adicionada com sucesso!'
        })
    } catch (err) {
        t.rollback();

        return res.status(err.status ? err.status : 500).json({
            status: err.status ? err.status : 500,
            message: err.message,
            success: false
        })
    }
}

/**
 * Delete user.
 * 
 * It is not possible to delete any user under any circumstances.
 */

export default {
    load, get, create, update, list, changePassword, confirmAccount, createUserImageUpload, fetchUser
};
