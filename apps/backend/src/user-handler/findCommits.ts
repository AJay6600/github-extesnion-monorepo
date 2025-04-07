import { RequestHandler } from 'express';
import { RequestType } from '../utils/types/RequestType';
import { GetAllCommitResponseType } from '@github-extension-monorepo/typescript';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import { getEmbedding } from '../utils/helpers/getEmbedding';
import { cosineSimilarity } from '../utils/helpers/cosineSimilarity';

/** Type for the get all commits request params */
type FindCommitsInputArgs = {
  commits: GetAllCommitResponseType[];
  question: string;
};

const reqHandler: RequestHandler<
  unknown,
  GetAllCommitResponseType[] | ErrorMessageResponseType,
  { input: FindCommitsInputArgs }
> = async (req: RequestType, res) => {
  const { commits, question } = req.body;

  if (!commits || !question) {
    let errorMessage = '';

    if (!commits && !question) {
      errorMessage = 'Commits and Question is missing';
    } else if (!commits) {
      errorMessage = 'Commits is not found';
    } else if (!question) {
      errorMessage = 'Question is not found';
    }
    return res.status(404).json({ message: errorMessage });
  }

  try {
    // Embed user query
    const questionEmbedding = await getEmbedding(question);

    // Score each commit
    const scoredCommits = await Promise.all(
      commits.map(
        async (commit: { message: string; sha: string; diff: string }) => {
          const commitEmbedding = await getEmbedding(commit.message);
          const score = cosineSimilarity(questionEmbedding, commitEmbedding);
          return { ...commit, score };
        }
      )
    );

    // Sort by relevance
    const sortedCommits: Array<GetAllCommitResponseType & { score: number }> =
      scoredCommits.sort((a, b) => b.score - a.score);

    res.json(
      sortedCommits.slice(0, 3).map((result) => ({
        sha: result.sha,
        message: result.message,
        htmlUrl: result.htmlUrl,
        url: result.url,
        date: result.date,
      }))
    );
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error' + (err as Error).message });
  }
};

export default reqHandler;
