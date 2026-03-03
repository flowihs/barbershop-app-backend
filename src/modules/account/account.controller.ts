import { Body, Controller, Get, HttpStatus, Patch } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AccountService } from "./account.service";
import { TelegramProfileDto } from "@/src/modules/account/dto/telegram-profile.dto";
import type { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import type { UpdateProfileRequestDto } from "@/src/modules/account/dto/update-profile-request.dto";
import { UpdateProfileResponseDto } from "@/src/modules/account/dto/update-profile-response.dto";
import { Authorization } from "@/src/shared/decorators/authorization.decorator";
import { UserInfo } from "@/src/shared/decorators/user.decorator";

@ApiTags("Account")
@Controller("account")
@Authorization()
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get("me")
	@ApiOperation({
		summary: "Получение данных текущего пользователя"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Данные профиля были успешно получены",
		type: TelegramProfileDto
	})
	public async getMe(
		@UserInfo() user: TelegramUserDto
	): Promise<TelegramProfileDto> {
		return this.accountService.getMe(user);
	}

	@Patch("update")
	@ApiOperation({
		summary: "Обновление данных пользователя"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Данные профиля были успешны обновлены"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Пользователь не был найден"
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Ошибка валидации входящих данных"
	})
	public async update(
		@UserInfo() userTg: TelegramUserDto,
		@Body() dto: UpdateProfileRequestDto
	): Promise<UpdateProfileResponseDto> {
		return this.accountService.update(userTg, dto);
	}
}
