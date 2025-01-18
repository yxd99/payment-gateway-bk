import { ApiResponseOptions } from '@nestjs/swagger';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const okGenerateAcceptanceTokenSchema: ApiResponseOptions = {
  description: 'generate acceptance token',
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
        description: 'Payment data',
        example: {
          acceptanceToken:
            'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MTAxLCJwZXJtYWxpbmsiOiJodHRwczovL2Zha2VsaW5rLmNvbS9hc3NldHMvZG93bmxvYWRibGUvcmVndWxhci1kb2N1bWVudC5wZGYiLCJmaWxlX2hhc2giOiJhYmNkMTIzZGVmNDU2N2g4OWphYmNkZWYxMjM0NTYiLCJqaXQiOiIxMjM0NTY3ODktMTAwMDAxIiwiZW1haWwiOiJmYWtlLnVzZXJAZXhhbXBsZS5jb20iLCJleHAiOjE4MDAwMDAwMDB9.-ABCDEFG1234567890ZYXWVUTSRQPONMLKJIHGFEDCBA',
          personalAuthToken:
            'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MjAwLCJwZXJtYWxpbmsiOiJodHRwczovL2Zha2VsaW5rLmNvbS9hc3NldHMvZG93bmxvYWRibGUvZG9jdW1lbnQtcGVyc29uYWwuYXBwLnBkZiIsImZpbGVfaGFzaCI6Ijg3Nj',
        },
      },
    },
  },
};

export const okPaymentByIdSchema: ApiResponseOptions = {
  description: 'get payment by id',
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
        type: 'object',
        description: 'Payment data',
        example: {
          id: '',
          product: {
            id: '',
            name: 'product name',
            price: 100,
            imageUrl: 'https://image.com',
            stock: 10,
            createdAt: '2022-01-01T00:00:00.000Z',
            updatedAt: '2022-01-01T00:00:00.000Z',
          },
          amount: 100,
          transactionId: '',
          createdAt: '2022-01-01T00:00:00.000Z',
          reference: '',
          customerEmail: 'customer@email.com',
          status: 'pending',
          statusMessage: 'Payment is pending',
        },
      },
    },
  },
};
