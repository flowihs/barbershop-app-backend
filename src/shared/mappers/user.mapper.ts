import { User } from "@prisma/client";
import { TelegramProfileDto } from "@/modules/account/dto/telegram-profile.dto";

export class UserMapper {
	static toResponse(user: User): TelegramProfileDto {
		return {
			id: Number(user.id),
			firstName: user.firstName,
			username: user.username,
			description: user.description,
			email: user.email
		};
	}
}
