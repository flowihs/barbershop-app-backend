import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Query,
	UseGuards
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiBody,
	ApiExtraModels,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags
} from "@nestjs/swagger";

import { ProvisionService } from "../services/provision.service";

import { Roles } from "@/generated";
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
import { Roles as RolesDecorator } from "@/src/shared/decorators/roles.decorator";
import { UserInfo } from "@/src/shared/decorators/user.decorator";
import { RolesGuard } from "@/src/shared/guards/roles.guard";
import { ParseBigIntPipe } from "@/src/shared/pipes/parse-bigint.pipe";

@ApiTags("Provision (Услуги)")
@ApiBearerAuth()
@ApiExtraModels(
	TelegramProfileDto,
	CategoryResponseDto,
	SlotResponseDto,
	ProvisionResponseDto
)
@Controller("provisions")
@Authorization()
@UseGuards(RolesGuard)
export class ProvisionController {
	constructor(private readonly provisionService: ProvisionService) {}

	@Post("create")
	@RolesDecorator(Roles.ADMIN, Roles.BARBER)
	@ApiOperation({
		summary: "Создание новой услуги",
		description:
			"Создаёт услугу для текущего авторизованного пользователя (только ADMIN или BARBER). Поле `time` — массив ISO‑строк времени слотов."
	})
	@ApiBody({ type: CreateProvisionRequestDto })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Услуга успешно создана",
		type: CreateProvisionResponseDto
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			"Ошибка валидации (время в прошлом, дубликаты слотов и т.д.)"
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "Пользователь не авторизован"
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: "Доступ запрещен (нужна роль ADMIN или BARBER)"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Категория не найдена"
	})
	public async create(
		@UserInfo() user: TelegramUserDto,
		@Body() dto: CreateProvisionRequestDto
	): Promise<CreateProvisionResponseDto> {
		return this.provisionService.create(dto, user);
	}

	@Get("all")
	@ApiOperation({
		summary: "Получение списка всех услуг",
		description:
			"Возвращает массив всех услуг в системе. Доступно всем авторизованным пользователям."
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Список услуг успешно получен",
		type: [ProvisionResponseDto]
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "В базе данных нет услуг"
	})
	public async findAll(): Promise<ProvisionResponseDto[]> {
		return this.provisionService.findAll();
	}

	@Get("sorted-by-price")
	@ApiOperation({
		summary: "Получение услуг с сортировкой по цене",
		description:
			"Позволяет отсортировать все услуги по возрастанию (asc) или убыванию (desc) цены."
	})
	@ApiQuery({
		name: "order",
		required: false,
		enum: ["asc", "desc"],
		description: "Направление сортировки (по умолчанию asc)"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Отсортированный список услуг получен",
		type: [ProvisionResponseDto]
	})
	public async findAllSortByPrice(
		@Query() query: SortProvisionPriceRequestDto
	): Promise<ProvisionResponseDto[]> {
		return this.provisionService.findAllSortedByPrice(query);
	}

	@Get("my")
	@ApiOperation({
		summary: "Услуги текущего пользователя",
		description:
			"Возвращает список услуг, которые создал текущий авторизованный юзер."
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Личные услуги получены",
		type: [ProvisionResponseDto]
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "У пользователя нет созданных услуг"
	})
	public async findMyProvisions(
		@UserInfo() user: TelegramUserDto
	): Promise<ProvisionResponseDto[]> {
		return this.provisionService.findByUser(BigInt(user.id));
	}

	@Get("free/:id")
	@ApiOperation({
		summary: "Получение услуги со свободными слотами",
		description:
			"Возвращает услугу по ID, фильтруя только те слоты, которые еще не забронированы (isBooking = false)."
	})
	@ApiParam({ name: "id", required: true, description: "BigInt ID услуги" })
	@ApiQuery({
		name: "order",
		required: false,
		enum: ["asc", "desc"],
		description: "Сортировка слотов по времени"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Услуга и свободные слоты получены",
		type: ProvisionResponseDto
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Услуга не найдена или свободных слотов нет"
	})
	public async findByIdAndFreeSlots(
		@Param("id", ParseBigIntPipe) provisionId: bigint,
		@Query("order") order?: "asc" | "desc"
	): Promise<ProvisionResponseDto> {
		return this.provisionService.findByIdAndFreeSlots(provisionId, order);
	}

	@Delete("my")
	@RolesDecorator(Roles.ADMIN, Roles.BARBER)
	@ApiOperation({
		summary: "Удаление всех своих услуг",
		description:
			"Полная очистка всех услуг текущего пользователя (ADMIN/BARBER)."
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Все услуги пользователя удалены",
		type: DeleteResponseDto
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Услуги не найдены"
	})
	public async deleteMyProvisions(
		@UserInfo() user: TelegramUserDto
	): Promise<DeleteResponseDto> {
		return this.provisionService.deleteByUser(user);
	}

	@Get(":id")
	@ApiOperation({
		summary: "Детальная информация об услуге",
		description:
			"Возвращает полную информацию об услуге по её ID, включая данные мастера и категории."
	})
	@ApiParam({ name: "id", required: true, description: "BigInt ID услуги" })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Данные услуги получены",
		type: ProvisionResponseDto
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Услуга с таким ID не найдена"
	})
	public async findById(
		@Param("id", ParseBigIntPipe) id: bigint
	): Promise<ProvisionResponseDto> {
		return this.provisionService.findById(id);
	}

	@Delete(":id")
	@RolesDecorator(Roles.ADMIN, Roles.BARBER)
	@ApiOperation({ summary: "Удаление конкретной услуги" })
	@ApiParam({ name: "id", required: true, description: "BigInt ID услуги" })
	@ApiResponse({ status: HttpStatus.OK, type: DeleteResponseDto })
	public async delete(
		@Param("id", ParseBigIntPipe) id: bigint,
		@UserInfo() user: TelegramUserDto
	): Promise<DeleteResponseDto> {
		return this.provisionService.deleteById(id, user);
	}
}
