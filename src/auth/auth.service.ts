import {
	AccessTokenPayload,
	RefreshTokenPayload,
	RefreshTokenPayloadDecode,
} from "@/interfaces/auth.interface";
import { User } from "@/users/schemas/user.schema";
import { UsersService } from "@/users/users.service";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { Document, Types } from "mongoose";
import ms from "ms";
import { AccountDto } from "./dto/account.dto";

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private readonly usersService: UsersService,
	) {}

	issueAccessToken(
		user:
			| AccountDto
			| (Document<unknown, {}, User> &
					User &
					Required<{
						_id: string | Types.ObjectId;
					}>),
	) {
		const payload: AccessTokenPayload = {
			email: user.email,
			_id: user._id,
			avatar: user.avatar,
			role: user.role,
			fullName: user.fullName,
			phone: user.phone,
		};
		return this.jwtService.sign(payload, {
			secret: this.configService.get("ACCESS_TOKEN_SECRET"),
			expiresIn:
				+ms(this.configService.get("ACCESS_TOKEN_EXPIRATION")) / 1000,
		});
	}
	issueAndPushRefreshToken(
		payload: RefreshTokenPayload,
		expiresIn: number,
		user:
			| AccountDto
			| (Document<unknown, {}, User> &
					User &
					Required<{
						_id: string | Types.ObjectId;
					}>),
		response: Response,
	) {
		const refresh_token = this.jwtService.sign(payload, {
			secret: this.configService.get("REFRESH_TOKEN_SECRET"),
			expiresIn: expiresIn,
		});
		this.usersService.updateRefreshToken(user._id as string, refresh_token);
		response.clearCookie("refresh_token", { httpOnly: true });
		response.cookie("refresh_token", refresh_token, {
			httpOnly: true,
			maxAge: ms(
				this.configService.get<string>("REFRESH_TOKEN_EXPIRATION"),
			),
		});
	}
	login(user: AccountDto, response: Response) {
		const refreshPayload: RefreshTokenPayload = {
			_id: user._id,
			fullName: user.fullName,
			role: user.role,
		};
		this.issueAndPushRefreshToken(
			refreshPayload,
			ms(this.configService.get<string>("REFRESH_TOKEN_EXPIRATION")),
			user,
			response,
		);
		return {
			access_token: this.issueAccessToken(user),
			user,
		};
	}

	async refresh(refresh_token: string, response: Response) {
		try {
			const { exp, iat, ...refreshPayload } =
				this.jwtService.verify<RefreshTokenPayloadDecode>(
					refresh_token,
					{
						secret: this.configService.get("REFRESH_TOKEN_SECRET"),
					},
				);
			const res =
				await this.usersService.findByRefreshToken(refresh_token);
			const user = res ? res.toObject() : null;
			if (!user) {
				throw new NotFoundException(
					"NOT FOUND USER WITH GIVEN REFRESH TOKEN",
				);
			}
			// refresh token rotation
			this.issueAndPushRefreshToken(
				refreshPayload,
				exp - Math.floor(Date.now() / 1000),
				user,
				response,
			);
			return {
				access_token: this.issueAccessToken(user),
				user,
			};
		} catch (error) {
			if (error?.name === "TokenExpiredError")
				throw new BadRequestException("Token has expired");
		}
	}
	logout(id: string, response: Response) {
		response.clearCookie("refresh_token", {
			path: "/",
			httpOnly: true,
		});
		this.usersService.updateRefreshToken(id, "");
		return "Log out successfully";
	}
}
