import { IsEmail, IsNumber, IsString, Matches, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateRatingDto {
  @IsString()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
