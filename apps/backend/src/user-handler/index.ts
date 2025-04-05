import { Router } from 'express';
import getAvatar from './getAvatar';
import isAuth from './isAuth';
import getRepositories from './getRepositories';
import getAllCommits from './getAllCommits';

const router = Router();

/** Get the Avatar of user */
router.get('/avatar/:username', isAuth, getAvatar);
/** Get All repos  */
router.get('/repos/:username', isAuth, getRepositories);
/** Get all commits of Repo */
router.post('/commits', isAuth, getAllCommits);

export default router;
