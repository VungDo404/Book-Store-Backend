import { Injectable } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument } from "./schemas/cart.schema";
import { SoftDeleteModel } from "mongoose-delete";
import { BulkDeleteCartDto } from "./dto/bulk-delete-cart.dto";
import { AccountDto } from "@/auth/dto/account.dto";

@Injectable()
export class CartService {
	constructor(
		@InjectModel(Cart.name)
		private cartModel: SoftDeleteModel<CartDocument>,
	) {}
	async create(createCartDto: CreateCartDto, userId: string) {
		const data = await this.cartModel.findOne({
			user: userId,
			book: createCartDto.book,
		});
		if (data) {
			this.cartModel
				.updateOne(
					{
						user: userId,
						book: createCartDto.book,
					},
					{ quantity: data.quantity + createCartDto.quantity },
				)
				.exec();
			return data._id;
		}
		const result = (
			await new this.cartModel({ ...createCartDto, user: userId }).save()
		).toObject();
		return result._id;
	}

	findAll(userId: string) {
		return this.cartModel
			.find({ user: userId }, "_id quantity")
			.sort("createdAt")
			.populate("book", "_id thumbnail mainText price")
			.exec();
	}

	findOne(id: number) {
		return `This action returns a #${id} cart`;
	}

	update(id: string, updateCartDto: UpdateCartDto, userId: string) {
		return this.cartModel
			.updateOne(
				{ _id: id, user: userId },
				{ quantity: updateCartDto.quantity },
			)
			.exec();
	}

	remove(id: string) {
		return this.cartModel.deleteById(id).exec();
	}
	bulkDelete(id: string[], user: AccountDto) {
		return this.cartModel.deleteMany({ user: user._id, _id: { $in: id } });
	}
}
