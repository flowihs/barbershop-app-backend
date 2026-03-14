import { Controller, HttpStatus, Param, Put } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

import { BookingService } from "../services/booking.service";

import { Authorization } from "@/src/shared/decorators/authorization.decorator";
import { ParseBigIntPipe } from "@/src/shared/pipes/parse-bigint.pipe";

@Authorization()
@Controller("booking")
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Put(":id")
	@ApiOperation({
		summary: "Бронирование слота по его id"
	})
	@ApiParam({
		name: "slotId",
		required: true,
		description: "ID слота для бронирования"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Произошла ошибка при бронировании"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Слот не был найден по данному id"
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "При бронировании слота произошла ошибка"
	})
	public async bookSlotById(
		@Param("slotId", ParseBigIntPipe) slotId: bigint
	) {
		return await this.bookingService.bookSlotById(slotId);
	}
}
