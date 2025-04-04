import axios, { AxiosError } from 'axios';
import { RequestHandler } from 'express';
import githubApiBaseUrl from '../utils/constants/githubApiBaseUrl';
import handleGithubApiErrors from '../utils/helpers/handleGithubApiError';
import { GetRepoResponseType } from '@github-extension-monorepo/typescript';
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
    const { data } = await axios.get(
      `${githubApiBaseUrl}/users/${username}/repos`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!data) {
      return res.status(404).json({ message: 'Repositories are not found' });
    }

    if (data && Array.isArray(data)) {
      if (data.length === 0) {
        return res
          .status(200)
          .json({ message: 'The user has no repositories' });
      }

      const repoData: GetRepoResponseType[] = data.map((repo) => ({
        id: repo['id'],
        name: repo['name'],
        htmlUrl: repo['html_url'],
        apiUrl: repo['url'],
      }));

      return res.status(200).json(repoData);
    }
  } catch (error) {
    const err = error as Error | AxiosError;

    return res.status(400).json({ message: handleGithubApiErrors(err) });
  }
};

export default reqHandler;
