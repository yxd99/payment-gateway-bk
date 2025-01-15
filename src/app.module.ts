import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from '@app/services/products.service';
import { ProductORM } from '@infrastructure/database/entities/product.orm.entity';
import { ProductRepositoryImpl } from '@infrastructure/database/repositories/product.repository';
import { typeormConfig } from '@infrastructure/database/typeorm';
import { ProductController } from '@infrastructure/http/controllers/products.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig()),
    TypeOrmModule.forFeature([ProductORM]),
  ],
  controllers: [ProductController],
  providers: [
    Logger,
    ProductService,
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryImpl,
    },
  ],
})
export class AppModule {}
