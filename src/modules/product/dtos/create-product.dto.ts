import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  name:string;

  @IsString()
  @IsOptional()
  description:string;

  @IsString()
  price:string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsMongoId()
  categoryId: string;
}