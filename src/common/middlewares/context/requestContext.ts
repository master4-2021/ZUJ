import * as cls from 'cls-hooked';
import { Request, Response } from 'express';
import { CORRELATIONID } from '../../constants';

export class RequestContext {
  public static nsid = 'REQUEST_CONTEXT';

  public static currentContext(): RequestContext {
    const session = cls.getNamespace(RequestContext.nsid);
    if (!session?.active) return null;
    return session.get(RequestContext.name);
  }

  public static currentRequest(): Request {
    const ctx = RequestContext.currentContext();
    if (!ctx) return null;
    return ctx.request;
  }

  public static remoteIP(): string {
    const ctx = RequestContext.currentContext();
    if (ctx) {
      return ctx.request.ip;
    }
    return null;
  }

  public static getCorrelationId(): string {
    const ctx = RequestContext.currentContext();
    if (ctx) {
      return ctx.request.headers[CORRELATIONID] as string;
    }
    return null;
  }

  public static url(): string {
    const ctx = RequestContext.currentContext();
    if (ctx) {
      return ctx.request.path;
    }
    return null;
  }

  public static method(): string {
    const ctx = RequestContext.currentContext();
    if (ctx) {
      return ctx.request.method;
    }
    return null;
  }

  public static get<T>(key: string): any {
    const ctx = RequestContext.currentContext();
    if (ctx) {
      return ctx.get<T>(key);
    }
    return null;
  }

  public static set<T>(key: string, value: T): void {
    const ctx = RequestContext.currentContext();
    if (ctx) {
      ctx.set<T>(key, value);
    }
  }

  public request: Request;

  public response: Response;

  private store: { [key: string]: any } = {};

  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
  }

  private set<T>(key: string, value: T): void {
    this.store[key] = value;
  }

  private get<T>(key: string): T {
    return this.store[key] as T;
  }
}
