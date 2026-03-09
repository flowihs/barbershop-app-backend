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
import {
	ApiBody,
	ApiExtraModels,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags
} from "@nestjs/swagger";

import { ProvisionService } from "../services/provision.service";

import { TelegramProfileDto } from "@/src/modules/account/dto/telegram-profile.dto";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { CategoryResponseDto } from "@/src/modules/category/dto/category-response.dto";
import { CreateProvisionRequestDto } from "@/src/modules/provision/dto/create-provision-request.dto";
import { CreateProvisionResponseDto } from "@/src/modules/provision/dto/create-provision-response.dto";
import { DeleteResponseDto } from "@/src/modules/provision/dto/delete-response.dto";
import { ProvisionResponseDto } from "@/src/modules/provision/dto/provision-response.dto";
import { SortProvisionPriceRequestDto } from "@/src/modules/provision/dto/sort-provision-price-request.dto";
import { SlotResponseDto } from "@/src/modules/slot/dto/slot-response.dto";
import { Authorization } from "@/src/shared/decorators/authorization.decorator";
import { UserInfo } from "@/src/shared/decorators/user.decorator";
import { ParseBigIntPipe } from "@/src/shared/pipes/parse-bigint.pipe";

@ApiTags("Provision")
@ApiExtraModels(
	TelegramProfileDto,
	CategoryResponseDto,
	SlotResponseDto,
	ProvisionResponseDto
)
@Controller("provisions")
@Authorization()
export class ProvisionController {
	constructor(private readonly provisionService: ProvisionService) {}

	@Post("create")
	@ApiOperation({
		summary: "Создание новой услуги",
		description:
			"Создаёт услугу для текущего авторизованного пользователя. Поле `time` — массив ISO‑строк времени слотов."
	})
	@ApiBody({
		type: CreateProvisionRequestDto,
		description: "Данные для создания услуги"
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Услуга успешно создана",
		type: CreateProvisionResponseDto
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Ошибка валидации входных данных"
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "Пользователь не авторизован"
	})
	public async create(
		@UserInfo() user: TelegramUserDto,
		@Body() dto: CreateProvisionRequestDto
	): Promise<CreateProvisionResponseDto> {
		return this.provisionService.create(dto, user);
	}

	@Get("all")
	@ApiOperation({
		summary: "Получение всех услуг",
		description:
			"Возвращает список всех услуг с вложенными user, category и отсортированными слотами."
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуги были успешно получены",
		type: [ProvisionResponseDto]
	})
	public async findAll(): Promise<ProvisionResponseDto[]> {
		return this.provisionService.findAll();
	}

	@Get("sorted-by-price")
	@ApiOperation({
		summary: "Получение всех услуг с сортировкой по цене",
		description: "Параметр `order` принимает `asc` или `desc`."
	})
	@ApiQuery({
		name: "order",
		required: false,
		description: "Направление сортировки: asc или desc",
		schema: { enum: ["asc", "desc"], default: "asc" }
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуги были успешно получены с сортировкой по цене",
		type: [ProvisionResponseDto]
	})
	public async findAllSortByPrice(
		@Query() query: SortProvisionPriceRequestDto
	) {
		return this.provisionService.findAllSortedByPrice(query);
	}

	@Get("my")
	@ApiOperation({
		summary: "Получение услуг текущего пользователя",
		description:
			"Возвращает услуги, созданные текущим авторизованным пользователем."
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуги пользователя были успешно получены",
		type: [ProvisionResponseDto]
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Записи пользователя не были найдены"
	})
	public async findMyProvisions(@UserInfo() user: TelegramUserDto) {
		return this.provisionService.findByUser(BigInt(user.id));
	}

	@Get("free/:id")
	@ApiOperation({
		summary: "Получение услуги со свободными слотами по id",
		description:
			"Возвращает услугу с массивом только свободных слотов (isBooking = false)."
	})
	@ApiParam({
		name: "id",
		required: true,
		description: "ID услуги (числовая строка)",
		example: "123"
	})
	@ApiQuery({
		name: "order",
		required: false,
		description:
			"Сортировка слотов по времени (asc или desc). По умолчанию asc.",
		schema: { enum: ["asc", "desc"], default: "asc" }
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуга со свободными слотами успешно получена",
		type: [ProvisionResponseDto]
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Услуга не была найдена"
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Некорректный id"
	})
	public async findByIdAndFreeSlots(
		@Param("id", ParseBigIntPipe) provisionId: bigint,
		@Query("order") order?: "asc" | "desc"
	): Promise<ProvisionResponseDto[]> {
		return this.provisionService.findByIdAndFreeSlots(provisionId, order);
	}

	@Get(":id")
	@ApiOperation({
		summary: "Получение услуги по id",
		description: "Возвращает услугу с вложенными user, category и слотами."
	})
	@ApiParam({
		name: "id",
		required: true,
		description: "ID услуги (числовая строка)",
		example: "123"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуга была успешно получена",
		type: ProvisionResponseDto
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Услуга не была найдена"
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Некорректный id"
	})
	public async findById(@Param("id", ParseBigIntPipe) id: bigint) {
		return this.provisionService.findById(id);
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Удаление услуги по id",
		description: "Удаляет услугу по её id. Возвращает результат операции."
	})
	@ApiParam({
		name: "id",
		required: true,
		description: "ID услуги (числовая строка)",
		example: "123"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуга была успешно удалена",
		type: DeleteResponseDto
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Услуга не была найдена"
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Некорректный id"
	})
	public async delete(
		@Param("id", ParseBigIntPipe) id: bigint
	): Promise<DeleteResponseDto> {
		return this.provisionService.deleteById(id);
	}

	@Delete("my")
	@ApiOperation({
		summary: "Удаление всех услуг текущего пользователя",
		description:
			"Удаляет все услуги, принадлежащие текущему авторизованному пользователю."
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуги пользователя были успешно удалены",
		type: DeleteResponseDto
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "У пользователя нет услуг для удаления"
	})
	public async deleteMyProvisions(
		@UserInfo() user: TelegramUserDto
	): Promise<DeleteResponseDto> {
		return this.provisionService.deleteByUser(user);
	}
}
