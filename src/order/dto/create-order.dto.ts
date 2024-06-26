import {
	ArrayNotEmpty,
	IsArray,
	IsMongoId,
	IsNumber,
	IsPositive,
	IsString,
	ValidateNested,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import mongoose from "mongoose";

class DetailDto {
	@IsString()
	bookName: string;
	@IsNumber()
	quantity: number;
	@IsMongoId()
	_id: mongoose.Schema.Types.ObjectId | string;
}
export class CreateOrderDto {
	@IsString()
	status: string = "SHIPPING";

	@IsString()
	name: string;

	@IsString()
	address: string;

	@IsString()
	phone: string;

	@IsString()
	type: string;

	@IsArray()
	@Expose()
	@ArrayNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => DetailDto)
	detail: DetailDto[];

	@IsNumber()
	@IsPositive()
	totalPrice: number;
}
