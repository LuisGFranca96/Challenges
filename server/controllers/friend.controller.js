import httpStatus from 'http-status';
import db from '../models';
import APIError from '../helpers/APIError';
const { Friend, sequelize } = db;
const load = async (req, res, next, id) => {}
const get = async (req, res, next, id) => {}
const create = async (req, res, next, id) => {}
const update = async (req, res, next, id) => {}
const list = async (req, res, next, id) => {
    return res.json({})
}
const remove = async (req, res, next, id) => {}
export default {load,get,create,update,list,remove};