import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  thumbnail: string;

  @Prop([String])
  slider: string[];

  @Prop({ required: true })
  mainText: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  sold: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  category: string;
}
export const BookSchema = SchemaFactory.createForClass(Book);
