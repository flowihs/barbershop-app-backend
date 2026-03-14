import { Injectable } from "@nestjs/common";

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
}
