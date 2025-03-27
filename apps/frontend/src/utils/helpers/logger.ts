import { AxiosError } from 'axios';

/**
 * Function logs an error using the console.
 * @param {Error} error - The parameter `error` is of type `Error`, which is an object that represents
 * an error that occurred during the execution of the program. It contains information about the error,
 * such as the error message and stack trace.
 */
export const logger = (
  error: Error | AxiosError | chrome.runtime.LastError
) => {
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;

    console.error(axiosError);
  }

  console.error(error);
};
