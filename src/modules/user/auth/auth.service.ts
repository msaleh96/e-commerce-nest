import { Injectable, ConflictException, BadRequestException, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CheckEmail } from '../check-email.schema';
import * as randomstring from 'randomstring';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(CheckEmail.name) private checkEmailModel: Model<CheckEmail>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { email, name, phone, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const existingCheck = await this.checkEmailModel.findOne({ email });
    if (existingCheck) {
      await this.checkEmailModel.deleteOne({ email });
    }

    let verificationCode = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });

    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   host: 'smtp.gmail.com',
    //   auth: {
    //     user: 'mohamedsaleh1881996@gmail.com',
    //     pass: 'xikfgsobpbgatloc',
    //   },
    // });

    // try {
    //   console.log('Sending verification email to:', email);
    //   await transporter.sendMail({
    //     from: 'mohamedsaleh1881996@gmail.com',
    //     to: email,
    //     subject: 'Verify email',
    //     text: verificationCode,
    //   });
    //   console.log('Email sent successfully');
    // } catch (err) {
    //   console.error('Error sending email:', err);
    //   throw new BadRequestException('Failed to send verification email');
    // }


    verificationCode= "1234"; 
    await this.checkEmailModel.create({
      name,
      email,
      phone,
      password,
      otp: verificationCode,
    });

    return { message: 'OTP sent to Email successfully!' };
  }

  async verifyOtp(email: string, otp: string) {
    const userData = await this.checkEmailModel.findOne({ email, otp });

    if (!userData) {
      throw new UnprocessableEntityException('OTP invalid');
    }

    const { name, phone, password } = userData;

    const user = new this.userModel({
      email,
      name,
      phone,
      password, 
      role: 'reader',
    });

    await user.save();

    await this.checkEmailModel.findByIdAndDelete(userData._id);

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '3h' });

    return {
      message: 'User created Successfully!',
      data: {
        token: accessToken,
        isAdmin: user.role === 'admin',
        userId: user._id,
        userName: user.name,
        email: user.email,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '3h' });

    return {
      message: 'Login successful!',
      data: {
        token: accessToken,
        isAdmin: user.role === 'admin',
        userId: user._id,
        userName: user.name,
        email: user.email,
      },
    };
  }

  async setAdmin(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.role = 'admin';
    await user.save();

    return { message: 'User promoted to admin successfully!' };
  }

}
