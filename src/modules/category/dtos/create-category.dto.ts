import { IsEmail, IsString, Matches } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name:string;
}