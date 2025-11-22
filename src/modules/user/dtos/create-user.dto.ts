import { IsEmail, IsString, Matches } from "class-validator";

export class CreateUserDto {
  @IsString()
  name:string;

  @IsEmail()
  email:string;


  @IsString()
  password:string;

  @Matches(/^01[0-9]{9}$/, {
    message: 'Phone number must be a valid Egyptian mobile number starting with 01 and followed by 9 digits',
  })
  phone: string;
}