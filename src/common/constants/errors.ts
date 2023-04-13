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
  startDateGreaterThanEndDate = 'startDateGreaterThanEndDate',
  oldPasswordEqualNewPassword = 'oldPasswordEqualNewPassword',
  entityNotFound = 'entityNotFound',
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
const NOT_FOUND: GenericError = {
  code: 'NOT_FOUND',
  statusCode: HttpStatus.NOT_FOUND,
  messages: {
    userNotFound: 'User not found',
    crudNotFound: 'Crud not found',
    entityNotFound: 'Entity not found',
  },
};
const BAD_REQUEST: GenericError = {
  code: 'BAD_REQUEST',
  statusCode: HttpStatus.BAD_REQUEST,
  messages: {
    invalidFilter: 'Invalid filter query',
    startDateGreaterThanEndDate: 'Start date greater than end date',
    invalidRefreshToken: 'Invalid refresh token',
    refreshTokenExpired: 'Refresh token expired',
    oldPasswordEqualNewPassword: 'Old password equal new password',
    invalidOldPassword: 'Invalid old password',
  },
};
const CONFLICT_ERROR: GenericError = {
  code: 'CONFLICT_ERROR',
  statusCode: HttpStatus.CONFLICT,
  messages: {
    userExisted: 'User existed',
    crudExisted: 'Crud existed',
  },
};
const FUNCTION_ERROR: GenericError = {
  code: 'FUNCTION_ERROR',
  statusCode: NaN,
  messages: {
    functionError: 'Function error',
  },
};
const FORBIDDEN: GenericError = {
  code: 'FORBIDDEN',
  statusCode: HttpStatus.FORBIDDEN,
  messages: {
    forbidden: 'Forbidden',
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
    userNamePasswordMissing: 'Username or password is missing',
  },
};

export {
  VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  FUNCTION_ERROR,
  SERVICE_UNAVAILABLE_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  CONFLICT_ERROR,
};
