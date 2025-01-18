import { ApiResponseOptions } from '@nestjs/swagger';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const badRequestSchema: ApiResponseOptions = {
  description:
    'Missing or invalid request body or Product with id already exists',
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
        description: 'Product data',
        example: [
          'page must not be less than 1',
          'page must be a number conforming to the specified constraints',
          'size must not be less than 1',
          'size must be a number conforming to the specified constraints',
        ],
      },
    },
  },
};
