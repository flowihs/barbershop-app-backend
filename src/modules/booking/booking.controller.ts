import { Controller, HttpStatus, Param, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { BookingService } from "./booking.service";
import { Authorization } from "@/src/shared/decorators/authorization.decorator";

@Authorization()
@Controller("booking")
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Put(":id")
	@ApiOperation({
		summary: "Изменение статуса брования по id"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Статус бронирования был изменен успешно"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Брование не было найдено"
	})
	public async changeBookingStatus(@Param("id") slotId: number) {
		return await this.bookingService.changeBookingStatus(slotId);
	}
}
