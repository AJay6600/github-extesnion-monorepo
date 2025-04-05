import { Col, message, Row } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from '../utils/helpers/getSessionFunc';
import { logger } from '../utils/helpers/logger';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorIndicator from '../components/ErrorIndicator';
import GetRepoForm from '../forms/GetRepoForm';

const RepoInfoPage = () => {
  /** This state handles the loading of authentication */
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  /** This state store the error while authentication */
  const [isAuthError, setIsAuthError] = useState<
    Error | chrome.runtime.LastError | null
  >(null);

  useEffect(() => {
    /** This function will implement the OAuth authentication
     * if the authentication already done then it will skip the oAuth steps
     */
    const startAuth = async () => {
      /** access token */
      const token = await getSessionStorageItem('token');

      /** If access token is not found in session then do the oAuth authentication */
      if (!token) {
        setIsAuthLoading(true);
        setIsAuthError(null);
        chrome.identity.launchWebAuthFlow(
          {
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/auth/github/code`,
            interactive: true,
          },
          async (redirectUrl) => {
            if (chrome.runtime.lastError) {
              setIsAuthError(chrome.runtime.lastError);
              logger(chrome.runtime.lastError);
              message.error(chrome.runtime.lastError.message);
              return;
            }

            if (redirectUrl) {
              const urlParams = new URLSearchParams(
                new URL(redirectUrl).search
              );

              const code = urlParams.get('code');

              if (code) {
                try {
                  const tokenResponse = await axios.post(
                    `${
                      import.meta.env.VITE_BACKEND_ENDPOINT
                    }/auth/github/token`,
                    { code }
                  );

                  const token: string =
                    tokenResponse && tokenResponse.data.token;

                  await setSessionStorageItem('token', token);
                  setIsAuthLoading(false);
                } catch (error) {
                  setIsAuthLoading(false);
                  setIsAuthError(error as Error);
                  logger(error as Error);
                  message.error((error as Error).message);
                }
              }
            }
          }
        );
      }
    };

    startAuth();
  }, []);

  /** Spinner will be loaded while loading */
  if (isAuthLoading) {
    return <LoadingIndicator />;
  }

  /** Error will be displayed if authentication got error  */
  if (isAuthError) {
    return <ErrorIndicator error={isAuthError} />;
  }

  return (
    <Row justify="center" align="middle">
      <Col>
        <GetRepoForm />
      </Col>
    </Row>
  );
};

export default RepoInfoPage;
