import { Body, Controller, Delete, Param, Post } from "@nestjs/common";

import { SlotService } from "../services/slot.service";

import { CreateSlotRequestDto } from "@/modules/slot/dto/create-slot-request.dto";
import { CreateSlotResponseDto } from "@/modules/slot/dto/create-slot-response.dto";
import { DeleteSlotResponseDto } from "@/modules/slot/dto/delete-slot-response.dto";
import { Authorization } from "@/shared/decorators/authorization.decorator";
import { ParseBigIntPipe } from "@/shared/pipes/parse-bigint.pipe";

@Authorization()
@Controller("slot")
export class SlotController {
	constructor(private readonly slotService: SlotService) {}

	@Post("create")
	public async create(
		@Body() createSlotRequestDto: CreateSlotRequestDto
	): Promise<CreateSlotResponseDto> {
		return this.slotService.create(createSlotRequestDto);
	}

	@Delete("delete/:id")
	public async deleteById(
		@Param("id", ParseBigIntPipe) id: bigint
	): Promise<DeleteSlotResponseDto> {
		return this.slotService.deleteById(id);
	}
}
