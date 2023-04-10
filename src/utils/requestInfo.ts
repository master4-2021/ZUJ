import { Request } from 'express';
import hideOrRemoveField from './hideOrRemoveField';
import { CORRELATIONID } from '../common/constants';

function getRequestInfo(request: Request) {
  return {
    method: request.method,
    url: request.url,
    query: request.query,
    body: hideOrRemoveField(request.body, 'password'),
    params: request.params,
    headers: request.headers,
    correlationId: request.headers[CORRELATIONID],
  };
}
export default getRequestInfo;
