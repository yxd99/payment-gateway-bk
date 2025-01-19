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

export const okPaymentByEmailSchema: ApiResponseOptions = {
  description: 'get payment by Email',
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
          id: '7df9777f-a632-4eb9-86ee-8d1ef9f129a8',
          product: {
            id: 'dc4ac251-b668-4a78-95d4-558e84deb064',
            name: 'Rustic Plastic Pants',
            price: 36554,
            imageUrl:
              'https://placeholder.pics/svg/600x900/000000/B3B3B3-000000/image-url',
            stock: 29,
            deletedAt: null,
            createdAt: '2025-01-19T01:36:08.406Z',
            updatedAt: '2025-01-19T01:36:08.406Z',
          },
          reference: 'a89126f4-248d-4683-908f-096d0620ec07',
          amount: '36554',
          transactionId: '15102-1731998388-86417',
          createdAt: '2025-01-19T08:13:11.762Z',
          customerEmail: 'rene.higuita@gmail.com',
          status: 'PENDING',
          address: 'cra 1 cll 1 ',
          city: 'SantaMarta',
          phone: '33344445566',
          state: 'Atlantico',
          productQuantity: 1,
        },
      },
    },
  },
};
