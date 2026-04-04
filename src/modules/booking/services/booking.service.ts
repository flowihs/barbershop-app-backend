import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { $Enums } from "@prisma/client";

import { BookingMapper } from "../../../shared/mappers/booking.mapper";
import { AccountService } from "../../account/services/account.service";
import { ProvisionQueryService } from "../../provision/services/provision-query.service";
import { SlotService } from "../../slot/services/slot.service";
import { BookingResponseDto } from "../dto/booking-response.dto";
import { BookingRepository } from "../repositories/booking.repository";

import BookingStatus = $Enums.BookingStatus;

@Injectable()
export class BookingService {
	public constructor(
		private readonly slotService: SlotService,
		private readonly bookingRepository: BookingRepository,
		private readonly accountService: AccountService,
		private readonly provisionQueryService: ProvisionQueryService
	) {}

	public async bookSlotById(slotId: bigint, clientId: bigint) {
		const slot = await this.slotService.findByIdAndIncludeProvision(slotId);

		try {
			const bookingData = {
				slotId: BigInt(slot.id),
				userId: clientId,
				totalPrice: slot.provision.price
			};

			await this.bookingRepository.bookSlotWithTransaction(
				slotId,
				bookingData
			);
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === "Slot is already booked"
			) {
				throw new BadRequestException("Слот уже забронирован");
			}
			throw new BadRequestException(
				"Произошла ошибка при бронировании слота. Транзакция откачена."
			);
		}

		return {
			status: 200,
			message: "Слот был успешно забронирован"
		};
	}

	public async cancelledBookSlotById(bookingId: bigint, userIdTg: number) {
		const userId: bigint = BigInt(userIdTg);
		const booking = await this.findById(bookingId);
		const provisionId: bigint = BigInt(booking.slot.provisionId);
		const provision =
			await this.provisionQueryService.findById(provisionId);

		if (!provision.user) {
			throw new NotFoundException("Владелец услуги не найден");
		}

		const ownerProvisionId: bigint = BigInt(provision.user.id);

		await this.accountService.findById(userId);

		if (booking.status == BookingStatus.CANCELLED) {
			throw new BadRequestException("Вы уже отказались от услуги");
		}

		if (booking.status === BookingStatus.COMPLETED) {
			throw new BadRequestException("Нельзя отменить выполненную услугу");
		}

		if (booking.userId !== userId && ownerProvisionId !== userId) {
			throw new BadRequestException(
				"Вы не можете отменить эту бронь. Это может сделать только клиент или владелец услуги."
			);
		}

		try {
			await this.bookingRepository.cancelBookingWithTransaction(
				bookingId,
				booking.slot.id
			);
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException(
				"Произошла ошибка при отмене бронирования. Транзакция откачена."
			);
		}

		return {
			status: 200,
			message: "Бронирование было успешно отменено"
		};
	}

	public async getAllByProvision(
		provisionId: bigint
	): Promise<BookingResponseDto[]> {
		const bookings =
			await this.bookingRepository.findAllByProvisionId(provisionId);

		return BookingMapper.toResponseList(bookings);
	}

	public async findByUser(userId: bigint) {
		const bookings = await this.bookingRepository.findByUser(userId);

		if (bookings.length === 0) {
			throw new NotFoundException(
				"У данного пользователя не были найдены забронированные услуги"
			);
		}

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
