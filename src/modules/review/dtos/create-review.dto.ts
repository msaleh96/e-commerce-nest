import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  review: string;

  @IsString()
  productId: string;
}
