import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AccessTokenPayloadDecode } from "@/interfaces/auth.interface";
import { AccountDto } from "../dto/account.dto";

@Injectable()
export class JwtStrategyAccessToken extends PassportStrategy(
	Strategy,
	"jwt-access-token",
) {
	constructor(readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET"),
		});
	}
	// When the token is valid, the validate method will be called (Success)
	async validate(payload: AccessTokenPayloadDecode): Promise<AccountDto> {
		return {
			_id: payload._id.toString(),
			fullName: payload.fullName,
			role: payload.role,
			email: payload.email,
			avatar: payload.avatar,
			phone: payload.phone,
		};
	}
}
