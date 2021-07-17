import express from 'express';
import friendCtrl from '../controllers/friend.controller';
// import { validate, Joi } from 'express-validation';
// import expressJwt from 'express-jwt';
// import paramValidation from '../../config/param-validation';
// import config from '../../config/vars';

const router = express.Router(); // eslint-disable-line new-cap
router.route('/')

    .get(friendCtrl.list)

    .post(friendCtrl.create);

router.route('/:friendId')

    .get(friendCtrl.get)

    .put(friendCtrl.update)

    .delete(friendCtrl.remove);
router.param('friendId', friendCtrl.load);

export default router;
