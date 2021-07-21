import httpStatus from 'http-status';
import db from '../models';
import APIError from '../helpers/APIError';

const { Friend, sequelize } = db;

const load = async (req, res, next, id) => {};

const get = async (req, res, next) => {};

const create = async (req, res, next) => {};

const update = async (req, res, next) => {};

const list = async (req, res, next) => {
  return Friend.findAll()
    .then((friends) => res.json({friends}))
    .catch((error) => res.boom.badRequest(error))
};

const remove = async (req, res, next) => {};

export default {
    load,
    get,
    create,
    update,
    list,
    remove,
};
