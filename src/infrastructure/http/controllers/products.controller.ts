import {
  Controller,
  Get,
  Param,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ProductService } from '@app/services/products.service';
import { badRequestSchema } from '@infrastructure/http/docs/products/bad-request.schema';
import { notFoundSchema } from '@infrastructure/http/docs/products/not-found.schema';
import {
  okFindAllSchema,
  okFindOneSchema,
} from '@infrastructure/http/docs/products/ok.schema';
import { PaginationDto } from '@infrastructure/http/dto/pagination.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse(okFindAllSchema)
  @ApiBadRequestResponse(badRequestSchema)
  @Get()
  async getAllProducts(@Query() pagination: PaginationDto) {
    const result = await this.productService.getProducts(pagination);

    if (!result.isSuccess) {
      throw new BadRequestException(result.getError());
    }

    return result;
  }

  @ApiOkResponse(okFindOneSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const result = await this.productService.getProductById(id);

    if (!result.isSuccess) {
      throw new NotFoundException(result.getError());
    }

    return result;
  }
}
