import { ApiResponseOptions } from '@nestjs/swagger';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const okFindOneSchema: ApiResponseOptions = {
  description: 'get products',
  schema: {
    properties: {
      code: {
        type: 'number',
        description: 'Status code',
        example: StatusCodes.OK,
      },
      name: {
        type: 'string',
        description: 'Status name',
        example: getReasonPhrase(StatusCodes.OK),
      },
      data: {
        type: 'object',
        description: 'Product data',
        example: {
          id: '',
          name: 'product name',
          price: 100,
          imageUrl: 'https://image.com',
          stock: 10,
          createdAt: '2022-01-01T00:00:00.000Z',
          updatedAt: '2022-01-01T00:00:00.000Z',
        },
      },
    },
  },
};

export const okFindAllSchema: ApiResponseOptions = {
  description: 'get products',
  schema: {
    properties: {
      code: {
        type: 'number',
        description: 'Status code',
        example: 200,
      },
      name: {
        type: 'string',
        description: 'Status name',
        example: 'OK',
      },
      data: {
        type: 'array',
        description: 'Product data',
        example: {
          id: '',
          name: 'product name',
          price: 100,
          imageUrl: 'https://image.com',
          stock: 10,
          createdAt: '2022-01-01T00:00:00.000Z',
          updatedAt: '2022-01-01T00:00:00.000Z',
        },
      },
    },
  },
};
