import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";

import { $Enums } from "@/generated";
import { BookingResponseDto } from "@/src/modules/booking/dto/booking-response.dto";
import { BookingRepository } from "@/src/modules/booking/repositories/booking.repository";
import { SlotService } from "@/src/modules/slot/services/slot.service";
import { BookingMapper } from "@/src/shared/mappers/booking.mapper";

import BookingStatus = $Enums.BookingStatus;

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

	public async cancelledBookSlotById(bookingId: bigint) {
		const booking = await this.findById(bookingId);

		if (booking.status == BookingStatus.CANCELLED) {
			throw new BadRequestException("Вы уже отказались от услуги");
		}

		if (booking.status === BookingStatus.COMPLETED) {
			throw new BadRequestException("Нельзя отменить выполненную услугу");
		}

		const bookingUpdateData = {
			status: BookingStatus.CANCELLED,
			cancelledAt: String(new Date())
		};

		return this.bookingRepository.update(bookingId, bookingUpdateData);
	}

	public async getAllByProvision(
		provisionId: bigint
	): Promise<BookingResponseDto[]> {
		const bookings =
			await this.bookingRepository.findAllByProvisionId(provisionId);

		return BookingMapper.toResponseList(bookings);
	}

	public async findById(id: bigint) {
		const booking = await this.bookingRepository.findById(id);

		if (!booking) {
			throw new NotFoundException("Запись не была найдена по данному id");
		}

		return booking;
	}
}
