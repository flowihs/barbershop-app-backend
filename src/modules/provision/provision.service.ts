import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { AccountService } from "@/src/modules/account/account.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { CreateProvisionDto } from "@/src/modules/provision/dto/create-provision.dto";
import { SortProvisionPriceDto } from "@/src/modules/provision/dto/sort-provision-price.dto";
import { SlotService } from "@/src/modules/slot/slot.service";

@Injectable()
export class ProvisionService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly accountService: AccountService,
		private readonly slotService: SlotService
	) {}

	public async create(dto: CreateProvisionDto, userTg: TelegramUserDto) {
		await this.accountService.findById(userTg.id);

		const slotsData = dto.time.map(timeStr => ({
			time: new Date(timeStr),
			isBooking: false
		}));

		const provision = await this.prismaService.provision.create({
			data: {
				...dto,
				user: {
					connect: {
						id: BigInt(userTg.id)
					}
				},
				slots: {
					create: slotsData
				}
			},
			include: {
				slots: true,
				user: {
					select: {
						id: true,
						firstName: true,
						username: true
					}
				}
			}
		});

		return provision;
	}

	public async deleteById(id: number) {
		await this.findById(id);

		return this.prismaService.provision.delete({
			where: {
				id
			}
		});
	}

	public async deleteByUser(userTg: TelegramUserDto) {
		await this.findByUser(userTg.id);

		return this.prismaService.provision.deleteMany({
			where: {
				userId: userTg.id
			}
		});
	}

	public async findAll() {
		return this.prismaService.provision.findMany();
	}

	public async findAllSortedByPrice(query: SortProvisionPriceDto) {
		return this.prismaService.provision.findMany({
			orderBy: {
				price: query.order
			}
		});
	}

	public async findById(id: number) {
		const provision = await this.prismaService.provision.findUnique({
			where: {
				id: BigInt(id)
			}
		});

		if (!provision) {
			throw new NotFoundException("Услуга не была найдена");
		}

		return provision;
	}

	public async findByUser(userId: number) {
		const provisions = await this.prismaService.provision.findMany({
			where: {
				userId: userId
			}
		});

		if (!provisions) {
			throw new NotFoundException(
				"Записи данного пользователя не были найдены"
			);
		}

		return provisions;
	}

	public async findByIdAndFreeSlots(
		provisionId: number,
		order?: "asc" | "desc"
	) {
		return this.slotService.getByIdAndFreeSlotsAndProvisionId(
			provisionId,
			order
		);
	}
}
