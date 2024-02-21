import { Message } from "@/decorators/message.decorator";
import {
	Controller,
	Get,
	Post,
	Request,
	Response,
	UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import {
	Response as ExpressResponse,
	Request as ExpressRequest,
} from "express";
import { Public } from "@/decorators/public.decorator";
import { User } from "@/decorators/user.decorator";
import { FetchAccount } from "@/interfaces/user.interface";
import { Cookies } from "@/decorators/cookie.decorator";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(AuthGuard("local"))
	@Public()
	@Message("Log in")
	@Post("login")
	async login(
		@Request() req: ExpressRequest,
		@Response({ passthrough: true }) response: ExpressResponse,
	) {
		return this.authService.login(req.user as FetchAccount, response);
	}

	@Message("Fetch current account")
	@Get("account")
	async account(@User() user: FetchAccount) {
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

	@Public()
	@Message("Log out")
	@Get("log out")
	async logout(
		@User() user: FetchAccount,
		@Response({ passthrough: true }) response: ExpressResponse,
	) {
		return this.authService.logout(user._id.toString(), response);
	}
}
