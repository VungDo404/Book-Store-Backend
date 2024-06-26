import { Book } from "@/book/schemas/book.schema";
import { User } from "@/users/schemas/user.schema";
import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema({_id: false })
export class Detail {
	@Prop({ required: true })
	bookName: string;

	@Prop({ required: true })
	quantity: number;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Book" })
	_id: Book;
}
@Schema({ timestamps: true })
export class Order {
	@Prop({ required: true })
	status: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	address: string;

	@Prop({ required: true })
	phone: string;

	@Prop({ required: true })
	type: string;

	@Prop({ type: [Detail], required: true })
	detail: Detail[];

	@Prop({ required: true })
	totalPrice: number;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
	user: User;
}


export const OrderSchema = SchemaFactory.createForClass(Order);
