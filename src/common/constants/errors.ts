import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { GenericError } from '../types';

export enum ErrorMessageEnum {
  internalServerError = 'internalServerError',
  invalidFilter = 'invalidFilter',
  invalidCredentials = 'invalidCredentials',
  invalidRefreshToken = 'invalidRefreshToken',
  invalidAccessToken = 'invalidAccessToken',
  accessTokenExpired = 'accessTokenExpired',
  refreshTokenExpired = 'refreshTokenExpired',
  accessTokenIsMissing = 'accessTokenIsMissing',
  forbidden = 'forbidden',
  userNotFound = 'userNotFound',
  userExisted = 'userExisted',
  crudNotFound = 'crudNotFound',
  crudExisted = 'crudExisted',
  invalidOldPassword = 'invalidOldPassword',
  userNamePasswordMissing = 'userNamePasswordMissing',
  functionError = 'functionError',
}

const VALIDATION_ERROR = (errs: ValidationError[]): GenericError => {
  const messages = errs.reduce((acc, err) => {
    acc[err.property] = Object.values(err.constraints);
    return acc;
  }, {});

  return {
    code: 'VALIDATION_ERROR',
    statusCode: HttpStatus.BAD_REQUEST,
    messages,
  };
};
const INTERNAL_SERVER_ERROR: GenericError = {
  code: 'INTERNAL_SERVER_ERROR',
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  messages: {
    internalServerError: 'Internal server error',
  },
};
const SERVICE_UNAVAILABLE_ERROR: GenericError = {
  code: 'SERVICE_UNAVAILABLE_ERROR',
  statusCode: HttpStatus.SERVICE_UNAVAILABLE,
  messages: {
    serviceUnavailable: 'Service unavailable',
  },
};
const FUNCTION_ERROR: GenericError = {
  code: 'FUNCTION_ERROR',
  statusCode: NaN,
  messages: {
    functionError: 'Function error',
  },
};
const INVALID_FILTER_QUERY: GenericError = {
  code: 'INVALID_FILTER_QUERY',
  statusCode: HttpStatus.BAD_REQUEST,
  messages: {
    invalidFilter: 'Invalid filter query',
  },
};
const UNAUTHORIZED: GenericError = {
  code: 'UNAUTHORIZED',
  statusCode: HttpStatus.UNAUTHORIZED,
  messages: {
    invalidCredentials: 'Invalid credentials',
    accessTokenIsMissing: 'Access token is missing',
    invalidAccessToken: 'Invalid access token',
    accessTokenExpired: 'Access token expired',
    userNotFound: 'User not found',
    invalidOldPassword: 'Invalid old password',
    userNamePasswordMissing: 'Username or password is missing',
  },
};
const REFRESH_TOKEN_ERROR: GenericError = {
  code: 'REFRESH_TOKEN_ERROR',
  statusCode: HttpStatus.BAD_REQUEST,
  messages: {
    invalidRefreshToken: 'Invalid refresh token',
    refreshTokenExpired: 'Refresh token expired',
  },
};
const FORBIDDEN: GenericError = {
  code: 'FORBIDDEN',
  statusCode: HttpStatus.FORBIDDEN,
  messages: {
    forbidden: 'Forbidden',
  },
};
const USER_NOT_FOUND: GenericError = {
  code: 'USER_NOT_FOUND',
  statusCode: HttpStatus.NOT_FOUND,
  messages: {
    userNotFound: 'User not found',
  },
};
const USER_EXISTED: GenericError = {
  code: 'USER_EXISTED',
  statusCode: HttpStatus.CONFLICT,
  messages: {
    userExisted: 'User existed',
  },
};
const CRUD_NOT_FOUND: GenericError = {
  code: 'CRUD_NOT_FOUND',
  statusCode: HttpStatus.NOT_FOUND,
  messages: {
    crudNotFound: 'Crud not found',
  },
};
const CRUD_EXISTED: GenericError = {
  code: 'CRUD_EXISTED',
  statusCode: HttpStatus.CONFLICT,
  messages: {
    crudExisted: 'Crud existed',
  },
};

export {
  VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
  INVALID_FILTER_QUERY,
  UNAUTHORIZED,
  FORBIDDEN,
  USER_NOT_FOUND,
  USER_EXISTED,
  CRUD_NOT_FOUND,
  CRUD_EXISTED,
  FUNCTION_ERROR,
  REFRESH_TOKEN_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
};
