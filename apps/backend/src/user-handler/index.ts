import { Router } from 'express';
import getAvatar from './getAvatar';
import isAuth from './isAuth';
import getRepositories from './getRepositories';

const router = Router();

router.get('/avatar/:username', isAuth, getAvatar);
router.get('/repos/:username', isAuth, getRepositories);

export default router;
