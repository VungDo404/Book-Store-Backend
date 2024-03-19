import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument } from "./schemas/order.schema";
import { SoftDeleteModel } from "mongoose-delete";
import { Service } from "@/shared/service";
import { BookService } from "@/book/book.service";
import { instanceToPlain } from "class-transformer";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrderService extends Service<Order> {
	constructor(
		@InjectModel(Order.name)
		private orderModel: SoftDeleteModel<OrderDocument>,
		private readonly bookService: BookService
	) {
		super(orderModel);
	}
	async create(createOrderDto: CreateOrderDto, userId: string) {
		try {
			for(const each of createOrderDto.detail){
				await this.bookService.updateBookQuantity(each._id, each.quantity)
			}
			const plain = instanceToPlain(createOrderDto);
			const result = (
				await new this.orderModel({ ...plain, user: userId }).save()
			).toObject();
			return result._id;
		} catch (error) {
			console.log(error)
			throw error;
		}
		
	}

	findOrderByUserId(userId: string){
		return this.orderModel.find({user: userId}, '-user'); 
	}
	async getCount(): Promise<number>{
		return this.orderModel.countDocuments();
	}
	update(id: string, updateDto: UpdateOrderDto) {
		return this.model.updateOne({ _id: id }, updateDto).exec();
	}
}
