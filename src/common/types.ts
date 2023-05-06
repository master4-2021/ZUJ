export enum ErrorMessageEnum {
  invalidFilter = 'invalidFilter',
  invalidCredentials = 'invalidCredentials',
  invalidRefreshToken = 'invalidRefreshToken',
  invalidAccessToken = 'invalidAccessToken',
  accessTokenExpired = 'accessTokenExpired',
  refreshTokenExpired = 'refreshTokenExpired',
  accessTokenIsMissing = 'accessTokenIsMissing',
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
  noErrMessageProvided = 'noErrMessageProvided',
  validationError = 'validationError',
  failedToSignJwt = 'failedToSignJwt',
}

export type Message = {
  code: string;
  content: string | Record<string, string[]>;
};

export type ErrorMessages = Record<ErrorMessageEnum, Message>;

export type DeepHideOrOmit<T, K extends keyof any, D extends boolean> = {
  [P in keyof T]: T[P] extends Array<infer U>
    ? Array<DeepHideOrOmit<U, K, D>>
    : T[P] extends Date
    ? P extends K
      ? D extends true
        ? never
        : '*****'
      : T[P]
    : T[P] extends Record<string, any>
    ? DeepHideOrOmit<T[P], K, D>
    : P extends K
    ? D extends true
      ? never
      : '*****'
    : T[P];
};

export type ResponseBody = {
  statusCode: number;
  message: string;
  url: string;
  success: boolean;
  timestamp: string;
  correlationId?: string;
  data?: any;
  took: string;
};
