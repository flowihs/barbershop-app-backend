import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../core/prisma/prisma.service";

interface TelegramUserData {
	id: bigint;
	first_name: string;
	username?: string;
}

@Injectable()
export class AccountRepository {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: bigint) {
		return this.prismaService.user.findUnique({
			where: { id }
		});
	}

	public async upsertFromTelegram(tgUser: TelegramUserData) {
		return this.prismaService.user.upsert({
			where: {
				id: tgUser.id
			},
			update: {
				firstName: tgUser.first_name,
				username: tgUser.username || null
			},
			create: {
				id: tgUser.id,
				firstName: tgUser.first_name,
				username: tgUser.username || null
			}
		});
	}

	public async update(
		id: bigint,
		data: {
			description?: string;
			email?: string;
		}
	) {
		return this.prismaService.user.update({
			where: { id },
			data
		});
	}
}
