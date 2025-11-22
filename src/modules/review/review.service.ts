import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { CreateReviewDto } from './dtos/create-review.dto';

@Injectable()
export class ReviewService {

  constructor(
    @InjectModel(Review.name) 
    private reviewModel: Model<Review>
  ) {}

  async createOrUpdateReview(dto: CreateReviewDto, userId: number) {
    const { review, productId } = dto;

    const exist = await this.reviewModel.findOne({
      productId: new mongoose.Types.ObjectId(productId),
      userId
    });

    if (exist) {
      await this.reviewModel.findByIdAndUpdate(exist._id, { review });
      return { message: 'Review updated successfully' };
    }

    await this.reviewModel.create({
      review,
      productId: new mongoose.Types.ObjectId(productId),
      userId
    });

    return { message: 'Review created successfully' };
  }

  async deleteReview(id: string, userId: number) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId.toString() !== userId.toString()) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    await this.reviewModel.findByIdAndDelete(id);

    return {
      status: 'success',
      message: 'Review deleted successfully',
    };
  }
}
