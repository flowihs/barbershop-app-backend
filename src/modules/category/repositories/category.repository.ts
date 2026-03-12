import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";

@Injectable()
export class CategoryRepository {
	constructor(private readonly prismaService: PrismaService) {}

	public async create(name: string) {
		return this.prismaService.category.create({
			data: {
				name: name
			}
		});
	}

	public async findByName(name: string) {
		return this.prismaService.category.findUnique({
			where: {
				name: name
			},
			include: {
				provisions: true
			}
		});
	}

	public async findById(id: bigint) {
		return this.prismaService.category.findUnique({
			where: { id },
			include: {
				provisions: true
			}
		});
	}

	public async deleteById(id: bigint) {
		return this.prismaService.category.delete({
			where: {
				id: id
			}
		});
	}

	public async deleteByName(name: string) {
		return this.prismaService.category.delete({
			where: {
				name: name
			}
		});
	}
}
