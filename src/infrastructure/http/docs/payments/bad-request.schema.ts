import { ApiResponseOptions } from '@nestjs/swagger';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const badRequestSchema: ApiResponseOptions = {
  description: 'payment bad request',
  schema: {
    properties: {
      code: {
        type: 'number',
        description: 'Status code',
        example: StatusCodes.BAD_REQUEST,
      },
      name: {
        type: 'string',
        description: 'Status name',
        example: getReasonPhrase(StatusCodes.BAD_REQUEST),
      },
      data: {
        type: 'array',
        description: 'Payment data',
        example: [
          'cardNumber must be a credit card',
          'cardNumber should not be empty',
          'cvc should not be empty',
          'invalid format date, must be MM/YY',
          'expirationDate should not be empty',
          'cardHolder must be a string',
          'cardHolder should not be empty',
          'productId must be a UUID',
          'productId should not be empty',
          'installments must be a number conforming to the specified constraints',
          'email must be an email',
          'email should not be empty',
          'acceptanceToken must be a string',
          'acceptanceToken should not be empty',
          'acceptPersonalAuth must be a string',
          'acceptPersonalAuth should not be empty',
        ],
      },
    },
  },
};
