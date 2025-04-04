import { Request } from 'express';

/** Custom request type for the api request */
export type RequestType = Request & {
  accessToken?: string;
};
