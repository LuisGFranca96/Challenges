import express from 'express';
import friendRoutes from './friend.route';

const router = express.Router(); // eslint-disable-line new-cap
router.use('/friends', friendRoutes);
export default router;
