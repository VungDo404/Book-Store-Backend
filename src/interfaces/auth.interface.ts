import { User } from "@/users/schemas/user.schema";

export interface LocalStrategyPayload
	extends Omit<User, "password" | "refreshToken"> {
	deleted: boolean;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
}

export interface AccessTokenPayload
	extends Omit<User, "password" | "refreshToken"> {}

export interface AccessTokenPayloadDecode extends AccessTokenPayload {
	iat: number;
	exp: number;
}

export interface RefreshTokenPayload
	extends Pick<User, "_id" | "fullName" | "role"> {}

export interface RefreshTokenPayloadDecode extends RefreshTokenPayload {
	iat: number;
	exp: number;
}

export interface GoogleOAuth {
	email: string;
	firstName: string;
	lastName: string;
	picture: string;
	accessToken: string;
	refreshToken: string;
	displayName: string;
}
