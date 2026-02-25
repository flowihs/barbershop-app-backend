import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { UpdateProfileDto } from "@/src/modules/account/dto/update-profile.dto";
import {
	UpdateProfileResponse,
	UserUpdateData
} from "@/src/shared/types/telegram.types";

@Injectable()
export class AccountService {
	constructor(private readonly prismaService: PrismaService) {}

	public async getMe(tgUser: TelegramUserDto) {
		const telegramId = BigInt(tgUser.id);

		return this.prismaService.user.upsert({
			where: {
				id: telegramId
			},
			update: {
				firstName: tgUser.first_name,
				username: tgUser.username
			},
			create: {
				id: telegramId,
				firstName: tgUser.first_name,
				username: tgUser.username
			}
		});
	}

	public async update(
		userTg: TelegramUserDto,
		dto: UpdateProfileDto
	): Promise<UpdateProfileResponse> {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: BigInt(userTg.id)
			}
		});

		if (!user) {
			throw new NotFoundException("Пользователь не был найден");
		}

		const updateData: UserUpdateData = {};

		if (dto.description !== undefined) {
			updateData.description = dto.description;
		}

		if (dto.email !== undefined) {
			updateData.email = dto.email;
		}

		if (Object.keys(updateData).length === 0) {
			return {
				success: false,
				message: "Все поля соответствуют текущим"
			};
		}

		return this.prismaService.user.update({
			where: {
				id: BigInt(userTg.id)
			},
			data: updateData
		});
	}
}
