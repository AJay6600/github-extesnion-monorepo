import axios, { AxiosError } from 'axios';
import { RequestHandler } from 'express';
import handleGithubApiErrors from '../utils/helpers/handleGithubApiError';
import { RequestType } from '../utils/types/RequestType';
import { GetAllCommitResponseType } from '@github-extension-monorepo/typescript';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';

/** Type for the get all commits request params */
type GetAllCommitsInputArgs = {
  repoLink: string;
};

const reqHandler: RequestHandler<
  unknown,
  GetAllCommitResponseType[] | ErrorMessageResponseType,
  { input: GetAllCommitsInputArgs }
> = async (req: RequestType, res) => {
  const { repoLink } = req.body;

  const accessToken = req.accessToken;

  if (!repoLink) {
    return res
      .status(400)
      .json({ message: 'Cannot find the access link of repo' });
  }

  try {
    const { data } = await axios.get(`${repoLink}/commits`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!data) {
      return res.status(404).json({ message: 'Commit data not found' });
    }

    if (data && Array.isArray(data)) {
      if (data.length === 0) {
        return res.status(200).json({ message: 'No commit found' });
      } else {
        const responseData: GetAllCommitResponseType[] = data.map((commit) => ({
          sha: commit['sha'],
          message: commit['commit']['message'],
          url: commit['url'],
          htmlUrl: commit['html_url'],
          date: new Date(commit['commit']['committer']['date']),
        }));

        return res.status(200).json(responseData);
      }
    }
  } catch (error) {
    const err = error as Error | AxiosError;

    return res.status(400).json({ message: handleGithubApiErrors(err) });
  }
};

export default reqHandler;
