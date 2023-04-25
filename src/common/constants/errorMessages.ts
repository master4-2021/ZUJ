import { ErrorMessages } from '../types';

export const messages: ErrorMessages = {
  failedToSignJwt: {
    code: 'FAILED_TO_SIGN_JWT',
    content: 'Failed to sign jwt',
  },
  noErrMessageProvided: {
    code: 'NO_ERR_MESSAGE_PROVIDED',
    content: 'No error message provided',
  },
  invalidFilter: {
    code: 'INVALID_FILTER',
    content: 'Invalid filter',
  },
  invalidCredentials: {
    code: 'INVALID_CREDENTIALS',
    content: 'Invalid credentials',
  },
  invalidRefreshToken: {
    code: 'INVALID_REFRESH_TOKEN',
    content: 'Invalid refresh token',
  },
  invalidAccessToken: {
    code: 'INVALID_ACCESS_TOKEN',
    content: 'Invalid access token',
  },
  accessTokenExpired: {
    code: 'ACCESS_TOKEN_EXPIRED',
    content: 'Access token expired',
  },
  refreshTokenExpired: {
    code: 'REFRESH_TOKEN_EXPIRED',
    content: 'Refresh token expired',
  },
  accessTokenIsMissing: {
    code: 'ACCESS_TOKEN_IS_MISSING',
    content: 'Access token is missing',
  },
  userNotFound: {
    code: 'USER_NOT_FOUND',
    content: 'User not found',
  },
  userExisted: {
    code: 'USER_EXISTED',
    content: 'User existed',
  },
  crudNotFound: {
    code: 'CRUD_NOT_FOUND',
    content: 'Crud not found',
  },
  crudExisted: {
    code: 'CRUD_EXISTED',
    content: 'Crud existed',
  },
  invalidOldPassword: {
    code: 'INVALID_OLD_PASSWORD',
    content: 'Invalid old password',
  },
  userNamePasswordMissing: {
    code: 'USERNAME_PASSWORD_MISSING',
    content: 'Username or password is missing',
  },
  functionError: {
    code: 'FUNCTION_ERROR',
    content: 'Function error',
  },
  startDateGreaterThanEndDate: {
    code: 'START_DATE_GREATER_THAN_END_DATE',
    content: 'Start date greater than end date',
  },
  oldPasswordEqualNewPassword: {
    code: 'OLD_PASSWORD_EQUAL_NEW_PASSWORD',
    content: 'Old password equal new password',
  },
  entityNotFound: {
    code: 'ENTITY_NOT_FOUND',
    content: 'Entity not found',
  },
  validationError: {
    code: 'VALIDATION_ERROR',
    content: 'N/A',
  },
};
