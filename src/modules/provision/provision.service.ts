import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";

@Injectable()
export class ProvisionService {
	private userId: number;
	constructor(private readonly prismaService: PrismaService) {}

	// public async create(userTgl: ITgUser): Promise<any> {
	// 	const user = await this.prismaService.user.findUnique({
	// 		where: {
	// 			id: userTgl.id
	// 		}
	// 	});
	// }
}
