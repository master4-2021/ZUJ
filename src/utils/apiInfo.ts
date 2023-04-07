import { Request } from 'express';

function getApiInfo(request: Request) {
  return {
    method: request.method,
    url: request.url,
    query: request.query,
    body: request.body,
    params: request.params,
    headers: request.headers,
    correlationId: request.headers['x-correlation-id'],
  };
}
export default getApiInfo;
