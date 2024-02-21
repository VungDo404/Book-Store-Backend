import { User } from "@/users/schemas/user.schema";

export interface FetchAccount extends Omit<User, 'password' | 'refreshToken'>{}