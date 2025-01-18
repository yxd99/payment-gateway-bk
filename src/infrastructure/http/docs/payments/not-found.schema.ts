import { ApiResponseOptions } from '@nestjs/swagger';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const notFoundSchema: ApiResponseOptions = {
  description: 'payment with id not found',
  schema: {
    properties: {
      code: {
        type: 'number',
        description: 'Status code',
        example: StatusCodes.NOT_FOUND,
      },
      name: {
        type: 'string',
        description: 'Status name',
        example: getReasonPhrase(StatusCodes.NOT_FOUND),
      },
      data: {
        type: 'object',
        description: 'Payment data',
        example: {
          /** */
        },
      },
    },
  },
};
