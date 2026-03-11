import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";

@Injectable()
export class CategoryRepository {
	constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: bigint) {
		return this.prismaService.category.findUnique({
			where: { id }
		});
	}

}
