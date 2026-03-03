import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { TelegramProfileDto } from "@/src/modules/account/dto/telegram-profile.dto";
import type { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import type { UpdateProfileRequestDto } from "@/src/modules/account/dto/update-profile-request.dto";
import { UpdateProfileResponseDto } from "@/src/modules/account/dto/update-profile-response.dto";
import type { UserUpdateData } from "@/src/shared/types/telegram.types";

@Injectable()
export class AccountService {
	constructor(private readonly prismaService: PrismaService) {}

	public async getMe(tgUser: TelegramUserDto):Promise<TelegramProfileDto> {
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
		dto: UpdateProfileRequestDto
	): Promise<UpdateProfileResponseDto> {
		await this.findById(userTg.id);

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

	public async findById(id: number): Promise<TelegramProfileDto> {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: id
			}
		});

		if (!user) {
			throw new NotFoundException("Пользователь не был найден");
		}

		return user;
	}
}
