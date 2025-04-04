import axios, { AxiosError } from 'axios';
import { Router } from 'express';
import handleGithubApiErrors from './utils/helpers/handleGithubApiError';

const router = Router();

/** Github client id for Oauth authentication */
const clientId = process.env.GITHUB_CLIENT_ID;

/** Github client secret for Oauth authentication */
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

/** This Route redirects the page to github oAuth authentication page */
router.get('/github/code', (req, res) => {
  const redirectUrl = process.env.FRONTEND_REDIRECT_URL;

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=user,repo`;

  res.redirect(authUrl);
});

/** This route returns the access token */
router.post('/github/token', async (req, res) => {
  const { code } = req.body;

  try {
    /**  Exchange the code for an access token */
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    /** access token */
    const { access_token } = tokenResponse.data;

    /** Send the JWT token to the frontend */
    return res.status(200).json({ token: access_token });
  } catch (error) {
    const err = error as Error | AxiosError;

    return res.status(500).json({
      message: `Failed to access the access token : ${handleGithubApiErrors(
        err
      )}`,
    });
  }
});

export default router;
