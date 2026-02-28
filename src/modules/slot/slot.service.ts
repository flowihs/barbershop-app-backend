import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { CreateSlotDto } from "@/src/modules/slot/dto/create-slot.dto";

@Injectable()
export class SlotService {
	constructor(private readonly prismaService: PrismaService) {}

	public async create(dto: CreateSlotDto) {
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
}
