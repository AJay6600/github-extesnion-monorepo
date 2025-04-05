/** Response type for get avatar  */
export type GetAvatarResponseType = {
  avatarUrl: string;
};

/** Response type for the get Repo */
export type GetRepoResponseType = {
  id: string;
  name: string;
  htmlUrl: string;
  apiUrl: string;
};

/** Response type for get all commit */
export type GetAllCommitResponseType = {
  sha: string;
  message: string;
  url: string;
  htmlUrl: string;
  date: Date;
};
