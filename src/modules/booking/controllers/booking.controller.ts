import {
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { BookingResponseDto } from "../dto/booking-response.dto";
import { BookingService } from "../services/booking.service";

import { TelegramUserDto } from "@/modules/account/dto/telegram-user.dto";
import { Authorization } from "@/shared/decorators/authorization.decorator";
import { UserInfo } from "@/shared/decorators/user.decorator";
import { ParseBigIntPipe } from "@/shared/pipes/parse-bigint.pipe";

@Authorization()
@ApiTags("Booking")
@Controller("booking")
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Post(":slotId")
	@ApiOperation({
		summary: "Book a time slot",
		description:
			"Creates a booking for the current user on a specific time slot"
	})
	@ApiParam({
		name: "slotId",
		required: true,
		description: "ID of the slot to book",
		type: "string"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Slot successfully booked",
		schema: {
			properties: {
				status: { type: "number", example: 200 },
				message: {
					type: "string",
					example: "Слот был успешно забронирован"
				}
			}
		}
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Slot not found"
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Slot is already booked or other error"
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "Invalid or missing authentication"
	})
	public async bookSlotById(
		@Param("slotId", ParseBigIntPipe) slotId: bigint,
		@UserInfo() user: TelegramUserDto
	) {
		return await this.bookingService.bookSlotById(slotId, BigInt(user.id));
	}

	@Delete(":bookingId")
	@ApiOperation({
		summary: "Cancel a booking",
		description:
			"Cancels an existing booking. Can be done by the client who made the booking or the service provider"
	})
	@ApiParam({
		name: "bookingId",
		required: true,
		description: "ID of the booking to cancel",
		type: "string"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Booking successfully cancelled",
		schema: {
			properties: {
				status: { type: "number", example: 200 },
				message: {
					type: "string",
					example: "Бронирование было успешно отменено"
				}
			}
		}
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Booking not found"
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			"Cannot cancel booking (already cancelled, completed, or no permission)"
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "Invalid or missing authentication"
	})
	public async cancelBooking(
		@Param("bookingId", ParseBigIntPipe) bookingId: bigint,
		@UserInfo() user: TelegramUserDto
	) {
		return await this.bookingService.cancelledBookSlotById(
			bookingId,
			user.id
		);
	}

	@Get("")
	@ApiOperation({
		summary: "Get current user's bookings",
		description: "Returns all bookings made by the authenticated user"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "List of user's bookings",
		type: [BookingResponseDto]
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "User has no bookings"
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "Invalid or missing authentication"
	})
	public async findByUser(@UserInfo() user: TelegramUserDto) {
		return await this.bookingService.findByUser(BigInt(user.id));
	}
}
