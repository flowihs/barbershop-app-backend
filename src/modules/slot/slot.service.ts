import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { CreateSlotRequestDto } from "@/src/modules/slot/dto/create-slot-request.dto";

@Injectable()
export class SlotService {
	constructor(private readonly prismaService: PrismaService) {}

	public async create(dto: CreateSlotRequestDto) {
		return this.prismaService.slot.create({
			data: dto
		});
	}

	public async findById(id: number) {
		const slot = await this.prismaService.slot.findUnique({
			where: {
				id
			}
		});

		if (!slot) {
			throw new NotFoundException("Слот не был найден");
		}

		return slot;
	}

	public async getAllFreeSlots(order: "asc" | "desc" = "asc") {
		return this.prismaService.slot.findMany({
			where: {
				isBooking: false
			},
			orderBy: {
				time: order
			}
		});
	}

	public async deleteById(id: number) {
		await this.findById(id);

		await this.prismaService.slot.delete({
			where: {
				id
			}
		});

		return {
			message: "Слот был удален успешно",
			success: true
		};
	}

	public async getAll() {
		return this.prismaService.slot.findMany();
	}
}
