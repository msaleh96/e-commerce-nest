import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    await this.createAdminIfNotExists();
  }

  async createAdminIfNotExists() {
    const adminExists = await this.userModel.exists({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    const adminUser = new this.userModel({
      name: 'Mohamed Saleh',
      email: 'MohamedSaleh18896@gmail.com',
      phone: '01550191001',
      password: '12345678',
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully.');
  }

  async findOne(id: string) {
    if (!id || id.length !== 24) {
      return null;
    }

    const user = await this.userModel.findById(id).select('-password');

    return user;
  }

}
