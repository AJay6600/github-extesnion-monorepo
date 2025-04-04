import axios, { AxiosError } from 'axios';
import { RequestHandler } from 'express';
import githubApiBaseUrl from '../utils/constants/githubApiBaseUrl';
import handleGithubApiErrors from '../utils/helpers/handleGithubApiError';
import { GetAvatarResponseType } from '@github-extension-monorepo/typescript';
import { RequestType } from '../utils/types/RequestType';

/** Type for the get avatar request params */
type GetAvatarParamArgs = {
  username: string;
};

const reqHandler: RequestHandler<GetAvatarParamArgs> = async (
  req: RequestType,
  res
) => {
  const { username } = req.params;

  const accessToken = req.accessToken;

  if (!username) {
    return res.status(400).json({ message: 'username not found' });
  }

  try {
    const { data } = await axios.get(`${githubApiBaseUrl}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!data) {
      return res.status(404).json({ message: 'Avatar is not found' });
    }

    const response: GetAvatarResponseType = { avatarUrl: data['avatar_url'] };

    return res.status(200).json(response);
  } catch (error) {
    const err = error as Error | AxiosError;

    return res.status(400).json({ message: handleGithubApiErrors(err) });
  }
};

export default reqHandler;
