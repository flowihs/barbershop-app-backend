import { User } from "@prisma/client";

export interface TelegramUser {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	language_code?: string;
	is_premium?: boolean;
	photo_url?: string;
}

export interface TelegramInitData {
	user?: TelegramUser;
	auth_date: number;
	hash: string;
	query_id?: string;
	start_param?: string;
}

export interface ITgUser {
	id: number;
	first_name: string;
	username?: string;
}

export interface UserUpdateData {
	description?: string;
	email?: string;
}

export interface IUserUpdateData {
	description?: string | null;
	email?: string | null;
	firstName?: string;
	username?: string | null;
}

export type UpdateProfileResponse =
	| User
	| {
			success: boolean;
			message: string;
	  };
