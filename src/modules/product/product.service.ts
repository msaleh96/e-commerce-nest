import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dtos/create-product.dto';
import * as fs from 'fs';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './product.schema';


@Injectable()
export class ProductService {

  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  
  async getProducts(page: number, perPage: number) {
    const skip = (page - 1) * perPage;

    const products = await this.productModel
      .find()
      .skip(skip)
      .limit(perPage)
      .populate('reviews')
      .exec();

    const total = await this.productModel.countDocuments();

    return {
      data: products,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async getProduct(id: string) {
    const product = await this.productModel.findById(id).populate('reviews').exec();
    if (!product) {
      return { message: 'product not found' };
    }
    return {
      message: 'product fetched Successfully!',
      data: product,
    };
  }


  async createProduct(files: Express.Multer.File[], dto: CreateProductDto) {
    const imagePaths: string[] = [];

    const uploadPath = 'uploads/products';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = `${uploadPath}/${fileName}`;

      fs.writeFileSync(filePath, file.buffer);

      imagePaths.push(filePath);
    }

    dto.images = imagePaths;

    const product = await new this.productModel(dto);
    product.save();
    return {
      message: 'Product created Successfully!',
      data: product,
    };
  }


  async updateProduct(
    id: string,
    dto: UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const uploadPath = 'uploads/products';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    if (files && files.length > 0) {
      const imagePaths: string[] = [];

      for (const file of files) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `${uploadPath}/${fileName}`;

        fs.writeFileSync(filePath, file.buffer);
        imagePaths.push(filePath);
      }

      dto.images = imagePaths;
    }

    for (const key of Object.keys(dto)) {
      if (dto[key] !== undefined) {
        product[key] = dto[key];
      }
    }

    await product.save();

    return {
      message: 'Product updated successfully!',
      data: product,
    };
  }


  async deleteProduct(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    return {
      message: 'product deleted Successfully!',
      data: product,
    };  
  }
}
