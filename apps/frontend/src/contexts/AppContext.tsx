import {
  GetAllCommitResponseType,
  GetRepoResponseType,
} from '@github-extension-monorepo/typescript';
import React, { useContext, useMemo, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

/** Type for App context */
type AppContextType = {
  repoResponse: GetRepoResponseType[] | null;
  commitResponse: GetAllCommitResponseType[] | null;
  selectedRepo: GetRepoResponseType | null;
  setRepoResponse: React.Dispatch<
    React.SetStateAction<GetRepoResponseType[] | null>
  >;
  setCommitResponse: React.Dispatch<
    React.SetStateAction<GetAllCommitResponseType[] | null>
  >;
  setSelectedRepo: React.Dispatch<
    React.SetStateAction<GetRepoResponseType | null>
  >;
};

/** App context */
const AppContext = React.createContext<AppContextType>({
  repoResponse: null,
  commitResponse: null,
  selectedRepo: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setRepoResponse: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCommitResponse: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedRepo: () => {},
});

/** react context provider */
export const AppContextProvider = ({ children }: Props) => {
  /** This state used to store repo response data */
  const [repoResponse, setRepoResponse] = useState<
    GetRepoResponseType[] | null
  >(null);

  /** This state used to store commit response data */
  const [commitResponse, setCommitResponse] = useState<
    GetAllCommitResponseType[] | null
  >(null);

  /** This state used to store selected repo id */
  const [selectedRepo, setSelectedRepo] = useState<GetRepoResponseType | null>(
    null
  );

  const contextValues = useMemo(
    () => ({
      repoResponse,
      commitResponse,
      selectedRepo,
      setRepoResponse,
      setCommitResponse,
      setSelectedRepo,
    }),
    [commitResponse, repoResponse, selectedRepo]
  );

  /** react context provider */
  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

/** App context hook */
export const useAppData = (): AppContextType =>
  useContext<AppContextType>(AppContext);
