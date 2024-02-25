import { User } from "@/users/schemas/user.schema";

export interface FetchAccount
	extends Pick<
		User,
		"_id" | "email" | "fullName" | "role" | "avatar" | "phone"
	> {}
