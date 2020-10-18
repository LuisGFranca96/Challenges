import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import expressJwt from "express-jwt";
import config from "../../config/vars";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/users/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

const router = express.Router(); // eslint-disable-line new-cap

router.route('/fetch')

    /** GET /api/users/fetch - Get list of users by name */
    .get(expressJwt({
        secret: config.jwtSecret,
        }), userCtrl.fetchUser
    );

router.route('/')

    /** GET /api/users - Get list of users */
    .get(expressJwt({
        secret: config.jwtSecret,
        }), userCtrl.list
    )

    /** POST /api/users - Create new user */
    .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')

    /** GET /api/users/:userId - Get user */
    .get(expressJwt({
        secret: config.jwtSecret,
        }), userCtrl.get)

    /** PUT /api/users/:userId - Update user */
    .put(expressJwt({
        secret: config.jwtSecret,
        }), validate(paramValidation.updateUser), userCtrl.update);

router.route('/upload/:userId')
    .post(
        expressJwt({secret: config.jwtSecret}),
        upload.single('avatar'),
        userCtrl.createUserImageUpload
    )

router.route('/change-password/:userId')
    .put(expressJwt({
        secret: config.jwtSecret,
        }),
        validate(paramValidation.changePassword),
        userCtrl.changePassword)

router.route('/confirm-account/:key')
    .put(validate(paramValidation.confirmAccount), (userCtrl.confirmAccount))

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
