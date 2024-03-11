import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { User } from "@/decorators/user.decorator";
import { Message } from "@/decorators/message.decorator";
import { AccountDto } from "@/auth/dto/account.dto";

@Controller("cart")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Post()
	@Message("Create  a cart")
	create(@Body() createCartDto: CreateCartDto, @User() user: AccountDto) {
		return this.cartService.create(createCartDto, user._id.toString());
	}

	@Get()
	@Message("Get all carts")
	findAll(@User() user: AccountDto) {
		return this.cartService.findAll(user._id.toString());
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.cartService.findOne(+id);
	}

	@Put(":id")
	@Message("Update a cart")
	update(
		@Param("id") id: string,
		@Body() updateCartDto: UpdateCartDto,
		@User() user: AccountDto,
	) {
		return this.cartService.update(id, updateCartDto, user._id);
	}

	@Delete(":id")
	@Message("Delete  a cart")
	remove(@Param("id") id: string) {
		return this.cartService.remove(id);
	}
}
