import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { SlotService } from "@/src/modules/slot/slot.service";

@Injectable()
export class BookingService {
	public constructor(
		private prismaService: PrismaService,
		private slotService: SlotService
	) {}

	public async changeBookingStatus(slotId: number) {
		const slot = await this.slotService.findById(slotId);

		await this.prismaService.slot.update({
			where: {
				id: slotId
			},
			data: {
				isBooking: !slot.isBooking
			}
		});
	}
}
