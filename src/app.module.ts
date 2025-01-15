import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeormConfig } from './infrastructure/database/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig())],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
