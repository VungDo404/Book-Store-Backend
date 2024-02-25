import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument } from "./schemas/order.schema";
import { SoftDeleteModel } from "mongoose-delete";
import { Service } from "@/shared/service";

@Injectable()
export class OrderService extends Service<Order> {
	constructor(
		@InjectModel(Order.name)
		private orderModel: SoftDeleteModel<OrderDocument>,
	) {
		super(orderModel);
	}
	async create(createOrderDto: CreateOrderDto, _id: string){
		const result = (await new this.orderModel(createOrderDto).save()).toObject();
		// console.log(result)
		return result; 
	}
}
