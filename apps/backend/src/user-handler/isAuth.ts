import { RequestHandler } from 'express';
import { RequestType } from '../utils/types/RequestType';

const reqHandler: RequestHandler = async (req: RequestType, res, next) => {
  /** Authorization header in request */
  const authHeader = req.get('Authorization');

  /** Check  authorization header is preset or not */
  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header is not found' });
  }

  /** Access token provided in header */
  const accessToken = authHeader.split(' ')[1];

  /** Check the token is provided or not */
  if (!accessToken) {
    res
      .status(401)
      .json({ message: 'Access token is not provided or malformed' });
  }

  req.accessToken = accessToken;

  next();
};

export default reqHandler;
