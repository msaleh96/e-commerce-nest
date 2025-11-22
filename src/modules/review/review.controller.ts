import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './dtos/create-review.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ReviewService } from './review.service';

@Controller('raviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(AuthGuard)
  @Post()
  createOrUpdateReview(@Body() body: CreateReviewDto, @CurrentUser() user:any) {    
    return this.reviewService.createOrUpdateReview(body, user._id);
  }
  
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteReview(@Param('id') id: string, @CurrentUser() user:any) {
    return this.reviewService.deleteReview(id, user._id);
  }

}
