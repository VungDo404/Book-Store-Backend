import { IsMongoId, IsNumber, IsPositive } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCartDto {
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsMongoId()
  book: mongoose.Schema.Types.ObjectId;
}
