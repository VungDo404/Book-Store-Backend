import { Message } from "@/decorators/message.decorator";
import {
	Controller,
	Get,
	Post,
	Response,
	UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import {
	Response as ExpressResponse,
} from "express";
import { Public } from "@/decorators/public.decorator";
import { User } from "@/decorators/user.decorator";
import { Cookies } from "@/decorators/cookie.decorator";
import { AccountDto } from "./dto/account.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(AuthGuard("local"))
	@Public()
	@Message("Log in")
	@Post("login")
	async login(
		@User() user: AccountDto,
		@Response({ passthrough: true }) response: ExpressResponse,
	) {
		return this.authService.login(user, response);
	}

	@Message("Fetch current account")
	@Get("account")
	async account(@User() user: AccountDto) {
		return { user };
	}

	@Public()
	@Message("Get new access token with refresh token")
	@Get("refresh")
	async refresh(
		@Cookies("refresh_token") refresh_token: string,
		@Response({ passthrough: true }) response: ExpressResponse,
	) {
		return this.authService.refresh(refresh_token, response);
	}

	@Message("Log out")
	@Post("logout")
	async logout(
		@User() user: AccountDto,
		@Response({ passthrough: true }) response: ExpressResponse,
	) {
		return this.authService.logout(user._id, response);
	}
}
