import { CreateBookDto } from "@/book/dto/create-book.dto";
import { UpdateBookDto } from "@/book/dto/update-book.dto";
import { Book } from "@/book/schemas/book.schema";
import { CreateOrderDto } from "@/order/dto/create-order.dto";
import { UpdateOrderDto } from "@/order/dto/update-order.dto";
import { Order } from "@/order/schemas/order.schema";
import { UpdateUserDto } from "@/users/dto/update-user.dto";
import { User } from "@/users/schemas/user.schema";

export type SchemaClass = User | Order | Book; 

export type UpdateDto = UpdateUserDto | UpdateBookDto | UpdateOrderDto; 

export type CreateDto = CreateBookDto | CreateOrderDto; 