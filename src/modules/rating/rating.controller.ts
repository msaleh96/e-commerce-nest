import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RatingService } from './rating.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @UseGuards(AuthGuard)
  @Post()
  createOrUpdateRating(@Body() body: CreateRatingDto, @CurrentUser() user:any) {    
    return this.ratingService.createOrUpdateRating(body, user._id);
  }
  
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteRating(@Param('id') id: string, @CurrentUser() user:any) {
    return this.ratingService.deleteRating(id, user._id);
  }

}
