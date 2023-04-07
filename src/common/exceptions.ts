import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessageEnum, INTERNAL_SERVER_ERROR } from './constants/errors';
import { GenericError } from './types';

export abstract class CustomException extends HttpException {
  isOperational: boolean;
  code: string;
  constructor(
    error: GenericError,
    selectedMessage: ErrorMessageEnum,
    isOperational: boolean,
  ) {
    const statusCode =
      error.statusCode ||
      (isOperational
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR);
    // if no selected message is provided, return all messages
    const message = selectedMessage
      ? error.messages[selectedMessage]
      : error.messages;
    super(message, statusCode);
    this.isOperational = isOperational;
    this.code = error.code;

    Object.setPrototypeOf(this, CustomException.prototype);
  }

  getCode() {
    return this.code;
  }
}

export class BusinessException extends CustomException {
  constructor(
    error: GenericError,
    selectedMessage: ErrorMessageEnum,
    isOperational = true,
  ) {
    super(error, selectedMessage, isOperational);
  }
}

export class TechnicalException extends CustomException {
  constructor(
    error: GenericError = INTERNAL_SERVER_ERROR,
    selectedMessage = ErrorMessageEnum.internalServerError,
    isOperational = false,
  ) {
    super(error, selectedMessage, isOperational);
  }
}

export class FunctionException extends CustomException {
  constructor(
    error: GenericError,
    selectedMessage: ErrorMessageEnum,
    isOperational = false,
  ) {
    super(error, selectedMessage, isOperational);
  }
}
