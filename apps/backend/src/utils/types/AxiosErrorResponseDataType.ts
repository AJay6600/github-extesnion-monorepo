/** Type definition for axios error response data */
export type AxiosErrorResponseDataType = {
  error: { errorCode: number; validationMessages: string[] };
} & {
  details: string;
  message: string;
  statusMessage: string;
  statusCode: number;
  timestamp: string;
};
