import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Query
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { ProvisionService } from "./provision.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { CreateProvisionDto } from "@/src/modules/provision/dto/create-provision.dto";
import { SortProvisionPriceDto } from "@/src/modules/provision/dto/sort-provision-price.dto";
import { Authorization } from "@/src/shared/decorators/authorization.decorator";
import { UserInfo } from "@/src/shared/decorators/user.decorator";

@Controller("provisions")
@Authorization()
export class ProvisionController {
	constructor(private readonly provisionService: ProvisionService) {}

	@Post()
	@ApiOperation({
		summary: "Создание новой услуги"
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Услуга успешно создана"
	})
	public async create(
		@UserInfo() user: TelegramUserDto,
		@Body() dto: CreateProvisionDto
	) {
		return this.provisionService.create(dto, user);
	}

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

	@Get("sorted-by-price")
	@ApiOperation({
		summary: "Получение всех услуг с сортировкой по цене"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуги были успешно получены с сортировкой по цене"
	})
	public async findAllSortByPrice(@Query() query: SortProvisionPriceDto) {
		return this.provisionService.findAllSortedByPrice(query);
	}

	@Get("my")
	@ApiOperation({
		summary: "Получение услуг текущего пользователя"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуги пользователя были успешно получены"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Записи пользователя не были найдены"
	})
	public async findMyProvisions(@UserInfo() user: TelegramUserDto) {
		return this.provisionService.findByUser(user.id);
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

	@Delete(":id")
	@ApiOperation({
		summary: "Удаление услуги по id"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуга была успешно удалена"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Услуга не была найдена"
	})
	public async delete(@Param("id") id: string) {
		return this.provisionService.deleteById(Number(id));
	}

	@Delete("my")
	@ApiOperation({
		summary: "Удаление всех услуг текущего пользователя"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуги пользователя были успешно удалены"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "У пользователя нет услуг для удаления"
	})
	public async deleteMyProvisions(@UserInfo() user: TelegramUserDto) {
		return this.provisionService.deleteByUser(user);
	}

	@ApiOperation({
		summary: "Получение услуг со свободными слотами"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуга со свободными слотами успешно получены"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Услуга не была найдена"
	})
	@Get("free")
	public async findByIdAndFreeSlots(
		@Param() provisionId: string,
		order?: "asc" | "desc"
	) {
		return await this.provisionService.findByIdAndFreeSlots(
			Number(provisionId),
			order
		);
	}
}
