import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsPhoneNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Detail } from '../schemas/order.schema';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  @IsPhoneNumber('VN')
  phone: string;

  @IsString()
  type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => Detail)
  detail: Detail[];

  @IsNumber()
  @IsPositive()
  totalPrice: number;
}
