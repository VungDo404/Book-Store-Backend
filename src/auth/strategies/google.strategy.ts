import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "@/users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor(
		readonly configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
			clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
			callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
			scope: ["email", "profile"],
            
		});
	}
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		const { name, emails, photos, displayName } = profile;
		const user = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken,
			refreshToken,
			displayName,
		};

		done(null, user);
	}
}
