import { Booking, Slot, User } from "@prisma/client";
import { BookingResponseDto } from "@/modules/booking/dto/booking-response.dto";
import { SlotMapper } from "@/shared/mappers/slot.mapper";
import { UserMapper } from "@/shared/mappers/user.mapper";

export class BookingMapper {
	static toResponse(
		booking: Booking & {
			user: User;
			slot: Slot;
		}
	): BookingResponseDto {
		return {
			id: Number(booking.id),
			status: booking.status,
			totalPrice: Number(booking.totalPrice),
			cancelledAt: String(booking.cancelledAt),
			slot: SlotMapper.toResponse(booking.slot),
			user: UserMapper.toResponse(booking.user)
		};
	}

	static toResponseList(
		bookings: Array<
			Booking & {
				user: User;
				slot: Slot;
			}
		>
	): BookingResponseDto[] {
		return bookings.map(booking => this.toResponse(booking));
	}
}
