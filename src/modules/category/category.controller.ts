import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('categories')
export class CategoryController {
  constructor(private cateogryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.cateogryService.getCategories();
  }

  @Get(':id')
  getCategory(@Param('id') id: string) {
    return this.cateogryService.getCategory(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  createCategory(@Body() body: CreateCategoryDto) {
    return this.cateogryService.createCategory(body);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Put(':id')
  updateCategory(@Body() body: CreateCategoryDto, @Param('id') id: string) {
    return this.cateogryService.updateCategory(id, body);
  }
  
  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.cateogryService.deleteCategory(id);
  }

}
