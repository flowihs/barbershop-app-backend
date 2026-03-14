import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";

@Injectable()
export class SlotRepository {
	constructor(private readonly prismaService: PrismaService) {}

	public async create(data: { time: string; provisionId: bigint }) {
		return this.prismaService.slot.create({
			data: {
				time: data.time,
				provisionId: data.provisionId
			}
		});
	}

	public async findById(id: bigint) {
		return this.prismaService.slot.findUnique({
			where: {
				id: id
			}
		});
	}

	public async findByIdAndIncludeProvision(id: bigint) {
		return this.prismaService.slot.findUnique({
			where: {
				id: id
			},
			include: {
				provision: true
			}
		});
	}

	public async deleteById(id: bigint) {
		return this.prismaService.slot.delete({
			where: {
				id: id
			}
		});
	}

	public async changeSlotBookingStatusById(
		id: bigint,
		isBookingStatus: boolean
	) {
		return this.prismaService.slot.update({
			where: {
				id: id
			},
			data: {
				isBooking: isBookingStatus
			}
		});
	}
}
