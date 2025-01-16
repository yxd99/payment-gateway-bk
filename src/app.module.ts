import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsService } from '@app/services/payments.service';
import { ProductService } from '@app/services/products.service';
import { PaymentORM } from '@infrastructure/database/entities/payment.orm.entity';
import { ProductORM } from '@infrastructure/database/entities/product.orm.entity';
import { PaymentRepositoryImpl } from '@infrastructure/database/repositories/payment.repository';
import { ProductRepositoryImpl } from '@infrastructure/database/repositories/product.repository';
import { typeormConfig } from '@infrastructure/database/typeorm';
import { PaymentsController } from '@infrastructure/http/controllers/payments.controller';
import { ProductController } from '@infrastructure/http/controllers/products.controller';
import { HttpClientService } from '@infrastructure/http/http-client.service';
import { PaymentApiService } from '@infrastructure/http/payment-api.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig()),
    TypeOrmModule.forFeature([ProductORM, PaymentORM]),
  ],
  controllers: [ProductController, PaymentsController],
  providers: [
    Logger,
    ProductService,
    PaymentsService,
    HttpClientService,
    PaymentApiService,
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryImpl,
    },
    {
      provide: 'PaymentRepository',
      useClass: PaymentRepositoryImpl,
    },
    {
      provide: 'PaymentApiRepository',
      useClass: PaymentApiService,
    },
  ],
})
export class AppModule {}
