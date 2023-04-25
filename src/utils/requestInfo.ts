import { Request } from 'express';
import { CORRELATIONID } from '../common/constants';
import hideOrOmitDeep from './hideOrOmitFields';

function getRequestInfo(request: Request) {
  return {
    method: request.method,
    url: request.url,
    query: request.query,
    body: hideOrOmitDeep(request.body, ['password']),
    params: request.params,
    headers: request.headers,
    correlationId: request.headers[CORRELATIONID],
  };
}
export default getRequestInfo;
