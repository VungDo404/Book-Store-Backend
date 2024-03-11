import { BookService } from "@/book/book.service";
import { OrderService } from "@/order/order.service";
import { UsersService } from "@/users/users.service";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseService implements OnModuleInit {
	private readonly logger = new Logger(DatabaseService.name);
	constructor(
		private configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly bookService: BookService,
        private readonly orderService: OrderService

	) {}
	async onModuleInit(): Promise<void> {
		const shouldInit = this.configService.get<string>(
			"SHOULD_SEEDING_DATA",
		);
		if (shouldInit === "true") {
			const userSeeding = await this.usersService.seeding();
			const bookSeeding = await this.bookService.seeding();

			if (userSeeding) this.logger.log("Seeding user data successfully");
			if (bookSeeding) this.logger.log("Seeding book data successfully");
		}
	}
    async dashBoard(){
        return {
            countUser: await this.usersService.getCount(), 
            countBook: await this.bookService.getCount(), 
            countOrder: await this.orderService.getCount()
        }
    }
}
