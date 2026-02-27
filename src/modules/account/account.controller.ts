import { Body, Controller, Get, HttpStatus, Patch } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AccountService } from "./account.service";
import type { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import type { UpdateProfileDto } from "@/src/modules/account/dto/update-profile.dto";
import { Authorization } from "@/src/shared/decorators/authorization.decorator";
import { UserInfo } from "@/src/shared/decorators/user.decorator";
import type { UpdateProfileResponse } from "@/src/shared/types/telegram.types";

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
		description: "Данные профиля были успешно получены"
	})
	public async getMe(@UserInfo() user: TelegramUserDto) {
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
		@Body() dto: UpdateProfileDto
	): Promise<UpdateProfileResponse> {
		return this.accountService.update(userTg, dto);
	}
}
