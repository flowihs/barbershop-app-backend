import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { AccountService } from "@/src/modules/account/account.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { CreateProvisionDto } from "@/src/modules/provision/dto/create-provision.dto";

@Injectable()
export class ProvisionService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly accountService: AccountService
	) {}

	public async findAll() {
		return this.prismaService.provision.findMany();
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

	public async create(dto: CreateProvisionDto, userTg: TelegramUserDto) {
		await this.accountService.findById(userTg.id);

		const slotsData = dto.time.map(timeStr => ({
			time: new Date(timeStr)
		}));

		const provision = await this.prismaService.provision.create({
			data: {
				title: dto.title,
				description: dto.description,
				price: dto.price,
				image: dto.image,
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
}
