import { Injectable } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument } from "./schemas/cart.schema";
import { SoftDeleteModel } from "mongoose-delete";

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
		return this.cartModel.find({user: userId}, '-user').populate('book').exec();
	}

	findOne(id: number) {
		return `This action returns a #${id} cart`;
	}

	update(id: string, updateCartDto: UpdateCartDto, userId: string) {
		return this.cartModel
			.updateOne(
				{_id: id, user: userId},
				{ quantity: updateCartDto.quantity },
			)
			.exec();
	}

	remove(id: string) {
		return this.cartModel.deleteById(id).exec();
	}
}
