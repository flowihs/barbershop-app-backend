import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AccountService } from "./account.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { UpdateProfileDto } from "@/src/modules/account/dto/update-profile.dto";
import { UserInfo } from "@/src/shared/decorators/user.decorator";
import { TelegramAuthGuard } from "@/src/shared/guards/auth.guard";
import { UpdateProfileResponse } from "@/src/shared/types/telegram.types";

@ApiTags("Account")
@Controller("account")
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get("me")
	@UseGuards(TelegramAuthGuard)
	public async getMe(@UserInfo() user: TelegramUserDto) {
		return this.accountService.getMe(user);
	}

	@Post("update")
	@UseGuards(TelegramAuthGuard)
	public async update(
		@UserInfo() userTg: TelegramUserDto,
		@Body() dto: UpdateProfileDto
	): Promise<UpdateProfileResponse> {
		return this.accountService.update(userTg, dto);
	}
}
