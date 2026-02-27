import { Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { ProvisionService } from "./provision.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { CreateProvisionDto } from "@/src/modules/provision/dto/create-provision.dto";
import { Authorization } from "@/src/shared/decorators/authorization.decorator";
import { UserInfo } from "@/src/shared/decorators/user.decorator";

@Controller("provision")
@Authorization()
export class ProvisionController {
	constructor(private readonly provisionService: ProvisionService) {}

	@Get("all")
	@ApiOperation({
		summary: "Получение всех услуг"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуги были успешно получены"
	})
	public async findAll() {
		return this.provisionService.findAll();
	}

	@Get(":id")
	@ApiOperation({
		summary: "Получение услуги по id"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуга была успешно получена"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Услуга не была найдена"
	})
	public async findById(@Param("id") id: string) {
		return this.provisionService.findById(Number(id));
	}

	@Post()
	public async create(
		@UserInfo() user: TelegramUserDto,
		dto: CreateProvisionDto
	) {
		return this.provisionService.create(dto, user);
	}
}
