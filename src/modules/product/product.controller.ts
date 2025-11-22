import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(
    @Query('page') page = '1',
    @Query('perPage') perPage = '10',
  ) {
    return this.productService.getProducts(+page, +perPage);
  }
  
  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProduct(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productService.createProduct(files, createProductDto);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('images'))
  updateCategory(@UploadedFiles() files: Express.Multer.File[],@Body() body: UpdateProductDto, @Param('id') id: string) {
    return this.productService.updateProduct(id, body, files);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

}
