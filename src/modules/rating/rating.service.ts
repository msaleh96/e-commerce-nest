import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { Rating } from './rating.schema';
import { Product } from '../product/product.schema';

@Injectable()
export class RatingService {

  constructor(@InjectModel(Rating.name) private ratingModel: Model<Rating>, @InjectModel(Product.name) private productModel: Model<Product>) {}

  async createOrUpdateRating(dto: CreateRatingDto, userId: number) {
    const { rating, productId } = dto;

    const exist = await this.ratingModel.findOne({ productId:new mongoose.Types.ObjectId(productId), userId });

    if (exist) {
      await this.ratingModel.findByIdAndUpdate(exist._id, { rating });
    } else {
      await this.ratingModel.create({ rating, productId:new mongoose.Types.ObjectId(productId), userId });
    }

    await this.updateProductRating(productId);

    return { message: 'success' };
  }

  async deleteRating(id: string, userId: number) {
    const rating = await this.ratingModel.findById(id);

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    if (rating.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You are not allowed to delete this rating');
    }

    const productId = rating.productId;

    await this.ratingModel.findByIdAndDelete(id);

    await this.updateProductRating(productId.toString());

    return {
      status: 'success',
      message: 'Rating deleted successfully',
    };
  }


  async updateProductRating(productId: string) {
    const average = await this.ratingModel.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);

    console.log(average);
    const avg = average?.[0]?.averageRating || 0;
    
    await this.productModel.findByIdAndUpdate(productId, {
      averageRating: avg,
    });
  }

}
