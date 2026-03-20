import { Injectable } from "@nestjs/common";
import { BookingStatus } from "@prisma/client";

import { PrismaService } from "@/src/core/prisma/prisma.service";

interface BookingCreateData {
	slotId: bigint;
	userId: bigint;
	totalPrice: number;
}

@Injectable()
export class BookingRepository {
	constructor(private readonly prismaService: PrismaService) {}

	public async create(data: BookingCreateData) {
		return this.prismaService.booking.create({
			data: {
				totalPrice: data.totalPrice,
				slot: {
					connect: {
						id: data.slotId
					}
				},
				user: {
					connect: {
						id: data.userId
					}
				}
			},
			include: {
				user: true,
				slot: true
			}
		});
	}

	public async findById(id: bigint) {
		return this.prismaService.booking.findUnique({
			where: {
				id: id
			},
			include: {
				user: true,
				slot: true
			}
		});
	}

	public async findAllByProvisionId(provisionId: bigint) {
		return this.prismaService.booking.findMany({
			where: {
				slot: {
					provisionId: provisionId
				}
			},
			include: {
				user: true,
				slot: true
			}
		});
	}

	public async update(
		id: bigint,
		data: {
			status?: BookingStatus;
			totalPrice?: number;
			cancelledAt?: string;
		}
	) {
		return this.prismaService.booking.update({
			where: {
				id: id
			},
			data: {
				...data
			}
		});
	}

	public async bookSlotWithTransaction(
		slotId: bigint,
		bookingData: BookingCreateData
	) {
		return this.prismaService.$transaction(async tx => {
			const slot = await tx.slot.findUnique({
				where: { id: slotId }
			});

			if (slot?.isBooking) {
				throw new Error("Слот уже забронирован");
			}

			await tx.slot.update({
				where: { id: slotId },
				data: { isBooking: true }
			});

			const booking = await tx.booking.create({
				data: {
					totalPrice: bookingData.totalPrice,
					slot: {
						connect: { id: bookingData.slotId }
					},
					user: {
						connect: { id: bookingData.userId }
					}
				},
				include: {
					user: true,
					slot: true
				}
			});

			return booking;
		});
	}

	public async cancelBookingWithTransaction(
		bookingId: bigint,
		slotId: bigint
	) {
		return this.prismaService.$transaction(async tx => {
			await tx.booking.update({
				where: { id: bookingId },
				data: {
					status: BookingStatus.CANCELLED,
					cancelledAt: new Date()
				}
			});

			await tx.slot.update({
				where: { id: slotId },
				data: { isBooking: false }
			});
		});
	}

	public async findByUser(userId: bigint) {
		return this.prismaService.booking.findMany({
			where: {
				userId: userId
			},
			include: {
				user: true,
				slot: true
			}
		});
	}
}
