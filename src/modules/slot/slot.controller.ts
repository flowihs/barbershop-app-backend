import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query
} from "@nestjs/common";

import { SlotService } from "./slot.service";
import { CreateSlotRequestDto } from "@/src/modules/slot/dto/create-slot-request.dto";
import { CreateSlotResponseDto } from "@/src/modules/slot/dto/create-slot-response.dto";
import { DeleteSlotResponseDto } from "@/src/modules/slot/dto/delete-slot-response.dto";

@Controller("slot")
export class SlotController {
	constructor(private readonly slotService: SlotService) {}

	@Post("create")
	public async create(
		@Body() createSlotRequestDto: CreateSlotRequestDto
	): Promise<CreateSlotResponseDto> {
		return this.slotService.create(createSlotRequestDto);
	}

	@Get("free")
	public async getAllFreeSlots(@Query("order") order?: "asc" | "desc") {
		return this.slotService.getAllFreeSlots(order);
	}

	@Delete("delete/:id")
	public async deleteById(
		@Param("id") id: string
	): Promise<DeleteSlotResponseDto> {
		return this.slotService.deleteById(Number(id));
	}
}
