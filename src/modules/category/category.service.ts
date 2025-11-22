import { Injectable } from '@nestjs/common';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {

  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const existing = await this.categoryModel.findOne({ name });
    if (existing) {
      return { message: 'Category already exists' };
    }
    const category = new this.categoryModel({ name });
    await category.save();

    return {
      message: 'Category created Successfully!',
      data: category,
    };
  }

  async updateCategory(id: string, createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const category = await this.categoryModel.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) {
      return { message: 'Category not found' };
    }
    return {
      message: 'Category updated Successfully!',
      data: category,
    };
  }

  async getCategory(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      return { message: 'Category not found' };
    }
    return {
      message: 'Category fetched Successfully!',
      data: category,
    };
  }

  async getCategories() {
    const categories = await this.categoryModel.find();
    return {
      message: 'Categories fetched Successfully!',
      data: categories,
    };  
  
  }

  async deleteCategory(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);
    return {
      message: 'Category deleted Successfully!',
      data: category,
    };  
  }
}
