import { Injectable } from "@nestjs/common";

import { BookingStatus } from "@/generated";
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
}
