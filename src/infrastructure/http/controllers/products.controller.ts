import {
  Controller,
  Get,
  Param,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';

import { ProductService } from '@app/services/products.service';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Query() pagination: PaginationDto) {
    const result = await this.productService.getProducts(pagination);

    if (!result.isSuccess) {
      throw new BadRequestException(result.getError());
    }

    return result;
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const result = await this.productService.getProductById(id);

    if (!result.isSuccess) {
      throw new NotFoundException(result.getError());
    }

    return result;
  }
}
