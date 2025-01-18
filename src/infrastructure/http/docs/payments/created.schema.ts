import { ApiResponseOptions } from '@nestjs/swagger';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const createPaymentSchema: ApiResponseOptions = {
  description: 'payment created',
  schema: {
    properties: {
      code: {
        type: 'number',
        description: 'Status code',
        example: StatusCodes.CREATED,
      },
      name: {
        type: 'string',
        description: 'Status name',
        example: getReasonPhrase(StatusCodes.CREATED),
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
