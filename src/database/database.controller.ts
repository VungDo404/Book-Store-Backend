import { Controller, Get } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { Message } from "@/decorators/message.decorator";

@Controller("database")
export class DatabaseController {
	constructor(private readonly databaseService: DatabaseService) {}
	@Get("dashboard")
	@Message("Get dash board")
	dashBoard() {
		return this.databaseService.dashBoard();
	}
}
