import { AxiosError } from 'axios';
import { AxiosErrorResponseDataType } from '../types/AxiosErrorResponseDataType';

const handleGithubApiErrors = (error: Error | AxiosError) => {
  let errorMessage = error.message;

  if (error instanceof AxiosError && error.response) {
    const axiosError = error.response.data as AxiosErrorResponseDataType;

    if (axiosError) {
      if (
        axiosError.error &&
        axiosError.error.validationMessages &&
        axiosError.error.validationMessages.length > 0 &&
        axiosError.error.validationMessages[0]
      ) {
        errorMessage = axiosError.error.validationMessages[0];
      }

      if (axiosError.message) {
        errorMessage = axiosError.message;
      }
    }
  }

  return errorMessage || 'Server error! Please try again';
};

export default handleGithubApiErrors;
