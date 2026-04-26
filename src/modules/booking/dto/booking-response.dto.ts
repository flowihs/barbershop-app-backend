import { ApiProperty } from "@nestjs/swagger";
import { TelegramProfileDto } from "@/modules/account/dto/telegram-profile.dto";
import { SlotResponseDto } from "@/modules/slot/dto/slot-response.dto";

export class BookingResponseDto {
	@ApiProperty({ example: 1, description: "Unique booking ID" })
	id: number;

	@ApiProperty({
		example: "CONFIRMED",
		description: "Booking status (CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)"
	})
	status: string;

	@ApiProperty({ example: 1500, description: "Total price in rubles" })
	totalPrice: number;

	@ApiProperty({
		example: "2026-03-20T10:30:00Z",
		description: "When the booking was cancelled (null if not cancelled)",
		nullable: true
	})
	cancelledAt?: string;

	@ApiProperty({
		type: SlotResponseDto,
		description: "The booked time slot"
	})
	slot: SlotResponseDto;

	@ApiProperty({
		type: TelegramProfileDto,
		description: "User who made the booking"
	})
	user: TelegramProfileDto;
}
