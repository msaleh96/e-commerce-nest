import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {

  @Prop({ required: true, unique: true, trim: true, minlength: 3 })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

