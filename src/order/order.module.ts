import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./schemas/order.schema";
import { BookModule } from "@/book/book.module";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
		BookModule,
	],
	controllers: [OrderController],
	providers: [OrderService],
	exports: [OrderService]
})
export class OrderModule {}
