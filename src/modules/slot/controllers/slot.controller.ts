import {
	Body,
	Controller,
	Delete,
	HttpStatus,
	Param,
	Post
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

import { Authorization } from "../../../shared/decorators/authorization.decorator";
import { ParseBigIntPipe } from "../../../shared/pipes/parse-bigint.pipe";
import { CreateSlotRequestDto } from "../dto/create-slot-request.dto";
import { CreateSlotResponseDto } from "../dto/create-slot-response.dto";
import { DeleteSlotResponseDto } from "../dto/delete-slot-response.dto";
import { SlotService } from "../services/slot.service";

import { ToggleLikeResponseDto } from "@/src/modules/like/dto/toggle-like-response.dto";

@Authorization()
@Controller("slot")
export class SlotController {
	constructor(private readonly slotService: SlotService) {}

	@Post("create")
	@ApiOperation({
		summary: "Создание слота",
		description: "Создает слота для услуги"
	})
	@ApiBody({
		type: CreateSlotRequestDto
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Слот для услуги был успешно создан",
		type: CreateSlotResponseDto
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "Пользователь не авторизован"
	})
	public async create(
		@Body() createSlotRequestDto: CreateSlotRequestDto
	): Promise<CreateSlotResponseDto> {
		return this.slotService.create(createSlotRequestDto);
	}

	@Delete("delete/:id")
	@ApiOperation({
		summary: "Создание слота",
		description: "Создает слота для услуги"
	})
	@ApiParam({
		name: "id",
		required: true,
		description: "ID слота"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Слот для услуги был успешно удален",
		type: CreateSlotResponseDto
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "Пользователь не авторизован"
	})
	public async deleteById(
		@Param("id", ParseBigIntPipe) id: bigint
	): Promise<DeleteSlotResponseDto> {
		return this.slotService.deleteById(id);
	}
}
