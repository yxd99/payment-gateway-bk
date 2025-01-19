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
        description: 'Payment created',
        example: {
          name: 'Created',
          code: 201,
          data: {
            id: '7df9777f-a632-4eb9-86ee-8d1ef9f129a8',
            amount: 36554,
            reference: 'a89126f3-248c-4682-908e-096d0620ec06',
            transactionId: '15102-1731998388-86417',
            customerEmail: 'rene.higuita@gmail.com',
            status: 'PENDING',
            address: 'cra 1 cll 1 ',
            city: 'SantaMarta',
            phone: '3154120000',
            department: 'Atlantico',
            productQuantity: 1,
            product: {
              id: 'dc4ac251-b668-4a78-95d4-558e84deb064',
              name: 'Rustic Plastic Pants',
              price: 36554,
              imageUrl:
                'https://placeholder.pics/svg/600x900/000000/B3B3B3-000000/image-url',
              stock: 29,
              createdAt: '2025-01-19T01:36:08.406Z',
              updatedAt: '2025-01-19T01:36:08.406Z',
            },
            createdAt: '2025-01-19T08:13:11.762Z',
          },
        },
      },
    },
  },
};
