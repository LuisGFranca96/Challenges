import APIError from '../helpers/APIError';
import crypto from "crypto-js";
import EmailProvider from "../services/emails/email.provider";
import db from '../models';

const { User, sequelize } = db;

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login = async (req, res, next) => {
    const {email, password} = req.body;
    const where = {email};

    try {
        const user = await User.findOne({
            where,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phone",
              "photo",
              "confirmed",
              "password",
              "createdAt",
              "updatedAt",
            ],
          });
    
        if (!user) {
            throw new APIError("Este usuário não existe.");
        }

        if (!(await User.passwordMatches(password, user.password))) {
            throw new APIError("Os campos e-mail e/ou senha estão inválidos.");
        }

        const token = User.sign(user);

        return res.json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                photo: user.photo,
                confirmed: user.confirmed,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            success: true
        })

    } catch(err) {
        return res.status(err.status ? err.status : 500).json({
            message: err.message,
            success: false,
            status: err.status ? err.status : 500
        });
    }
}

const token = async (req, res, next) => {
    const { user } = req;

    try {
        const foundUser = await User.findOne({
            where: {id: user.id},
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phone",
              "photo",
              "confirmed",
              "password",
              "createdAt",
              "updatedAt",
            ],
          });
    
        if (!foundUser) {
            throw new APIError("Este usuário não existe.");
        }

        const token = User.sign(foundUser);

        return res.json({
            token,
            user: {
                id: foundUser.id,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                email: foundUser.email,
                phone: foundUser.phone,
                photo: foundUser.photo,
                confirmed: foundUser.confirmed,
                createdAt: foundUser.createdAt,
                updatedAt: foundUser.updatedAt
            },
            success: true
        })

    } catch(err) {
        return res.status(err.status ? err.status : 500).json({
            message: err.message,
            success: false,
            status: err.status ? err.status : 500
        });
    }
}

const askResetPassword = async (req, res, next) => {
    const {email} = req.body;
    const where = {email};

    const t = await sequelize.transaction();
    try {
        const user = await User.findOne({ where });

        if (!user) {
            throw new APIError("Usuário não encontrado ou inexistente.");
        }

        const hash = crypto.MD5(user.email + new Date());

        const updatedUser = await user.update({
            key: hash.toString()
        }, { transaction: t });

        if (!updatedUser) {
            throw new APIError("Houve um erro ao processar a solicitação");
        }

        if ((await EmailProvider.sendPasswordReset(user))) {
            throw new APIError("Houve um erro ao processar o envio de e-mail");
        }

        await t.commit();

        return res.json({
            success: true,
            message: "Em alguns instantes você receberá instruções em seu e-mail para finalizar a troca de sua senha."
        });
    } catch (err) {
        await t.rollback();
        return res.status(err.status).json({
            message: err.message,
            success: false,
            status: err.status
        });
    }
}

const resetPassword = async (req, res, next) => {
    const {key} = req.params;

    try {
        if (!key) {
            throw new APIError("Chave inválida.");
        }
        const where = {key}

        const user = await User.findOne({
            where,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "key",
              "confirmed",
              "createdAt",
              "updatedAt",
            ],
        });

        if (!user) {
            throw new APIError("Chave inválida.");
        }

        return res.json({
            user,
            success: true,
            message: "Usuário encontrado! Redefina sua senha."
        });
    } catch (err) {
        return res.status(err.status).json({
            message: err.message,
            success: false,
            status: err.status
        });
    }
}

const postResetPassword = async (req, res, next) => {
    const {password, repeatPassword, UserId, key} = req.body;

    const t = await sequelize.transaction();
    try {
        if (password !== repeatPassword) {
            throw new APIError("As senhas não coincidem. Tente novamente.");
        }

        const user = await User.findOne({where: {id: UserId, key}});

        const hash = await User.passwordHash(password);

        const updatedUser = await user.update({
            password: hash,
            key: null,
            confirmed: true
        }, { transaction: t });

        if (!updatedUser) {
            throw new APIError("Houve algum erro durante a troca de senha.");
        }

        await t.commit();

        return res.json({
            success: true,
            message: "Senha atualizada com sucesso!",
        });
    } catch (err) {
        await t.rollback();
        return res.status(err.status).json({
            success: false,
            message: err.message,
            status: err.status
        })
    }
}

export default { login, askResetPassword, resetPassword, postResetPassword, token };
