import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) 
export class CheckEmail extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;

  @Prop({ required: true, match: /^01\d{9}$/ })
  phone: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: true })
  otp: string;

  @Prop({
    default: Date.now,
    expires: 3600,
  })
  createdAt: Date;
}

export const CheckEmailSchema = SchemaFactory.createForClass(CheckEmail);
