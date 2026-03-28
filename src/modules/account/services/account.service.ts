import { Injectable, NotFoundException } from "@nestjs/common";

import { TelegramProfileDto } from "../dto/telegram-profile.dto";
import type { TelegramUserDto } from "../dto/telegram-user.dto";
import { UpdateProfileRequestDto } from "../dto/update-profile-request.dto";
import { UpdateProfileResponseDto } from "../dto/update-profile-response.dto";
import { AccountRepository } from "../repositories/account.repository";
import { UserMapper } from "../../../shared/mappers/user.mapper";

@Injectable()
export class AccountService {
	constructor(private readonly accountRepository: AccountRepository) {}

	public async getMe(tgUser: TelegramUserDto): Promise<TelegramProfileDto> {
		const user = await this.accountRepository.upsertFromTelegram({
			id: BigInt(tgUser.id),
			first_name: tgUser.first_name,
			username: tgUser.username
		});

		return UserMapper.toResponse(user);
	}

	public async update(
		userTg: TelegramUserDto,
		dto: UpdateProfileRequestDto
	): Promise<UpdateProfileResponseDto> {
		const userId = BigInt(userTg.id);

		await this.findById(userId);

		const updateData: { description?: string; email?: string } = {};

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

		const user = await this.accountRepository.update(userId, updateData);

		return {
			...UserMapper.toResponse(user),
			success: true,
			message: "Профиль успешно обновлен"
		};
	}

	public async findById(id: bigint): Promise<TelegramProfileDto> {
		const user = await this.accountRepository.findById(id);

		if (!user) {
			throw new NotFoundException("Пользователь не был найден");
		}

		return UserMapper.toResponse(user);
	}
}
