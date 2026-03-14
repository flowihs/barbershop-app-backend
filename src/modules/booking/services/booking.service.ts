import { BadRequestException, Injectable } from "@nestjs/common";

import { BookingRepository } from "@/src/modules/booking/repositories/booking.repository";
import { SlotService } from "@/src/modules/slot/services/slot.service";

@Injectable()
export class BookingService {
	public constructor(
		private readonly slotService: SlotService,
		private readonly bookingRepository: BookingRepository
	) {}

	public async bookSlotById(slotId: bigint) {
		const slot = await this.slotService.findByIdAndIncludeProvision(slotId);

		if (slot.isBooking) {
			throw new BadRequestException("Слот уже забронирован");
		}

		await this.slotService.changeSlotBookingStatusById(slotId, true);

		const bookingData = {
			slotId: BigInt(slot.id),
			userId: BigInt(slot.provision.userId),
			totalPrice: slot.provision.price
		};

		const booking = await this.bookingRepository.create(bookingData);

		if (!booking) {
			throw new BadRequestException(
				"Произошла ошибка при попытке создании записи"
			);
		}

		return {
			status: 200,
			message: "Слот был успешно забронирован"
		};
	}
}
