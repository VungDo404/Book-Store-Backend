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
import { Cookies } from "@/decorators/cookie.decorator";
import { AccountDto } from "./dto/account.dto";
import { GoogleOAuthGuard } from "@/guard/google-oauth.guard";
import { ExcludeInterceptor } from "@/decorators/exclude-transform-interceptor.decorator";

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

	@Get("google")
	@Public()
	@UseGuards(GoogleOAuthGuard)
	async googleAuth(@Request() req) {}

	@Get("google-redirect")
	@Public()
	@Message('Google login')
	@ExcludeInterceptor(false)
	@UseGuards(GoogleOAuthGuard)
	googleAuthRedirect(
		@Request() req,
		@Response({ passthrough: true }) response: ExpressResponse,
	) {
		return this.authService.googleLogin(req, response);
	}
}
