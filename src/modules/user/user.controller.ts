import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('auth')
export class UserController {
  constructor(private authService:AuthService){}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto){
    return this.authService.signUp(body);
  }

  @Post('/verify-otp')
  verifyOtp(@Body() body: VerifyOtpDto){
    const { email, otp } = body;
    return this.authService.verifyOtp(email, otp);
  }

  @Post('/login')
  login(@Body() body: LoginDto){
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post('/set-admin')
  setAdmin(@Body('email') email: string, @CurrentUser() user:any){
    console.log(user);
    
    return this.authService.setAdmin(email);
  }

}
