import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";
import { UpdateData } from "@/src/shared/types/provision.types";

const DEFAULT_INCLUDE = {
	user: true,
	category: true,
	slots: {
		orderBy: {
			time: "asc" as const
		}
	}
};

@Injectable()
export class ProvisionRepository {
	constructor(private readonly prismaService: PrismaService) {}

	public async create(
		data: {
			title: string;
			description: string;
			price: number;
			image: string;
		},
		categoryId: bigint,
		userId: bigint,
		slotsData: Array<{
			time: Date;
			isBooking: boolean;
		}>
	) {
		return this.prismaService.provision.create({
			data: {
				...data,
				category: {
					connect: { id: categoryId }
				},
				user: {
					connect: { id: userId }
				},
				slots: {
					create: slotsData
				}
			},
			include: DEFAULT_INCLUDE
		});
	}

	public async deleteById(id: bigint) {
		return this.prismaService.provision.delete({
			where: { id }
		});
	}

	public async deleteByUserId(userId: bigint) {
		return this.prismaService.provision.deleteMany({
			where: { userId }
		});
	}

	public async findAll() {
		return this.prismaService.provision.findMany({
			include: DEFAULT_INCLUDE
		});
	}

	public async findAllSortedByPrice(query: "asc" | "desc") {
		return this.prismaService.provision.findMany({
			include: DEFAULT_INCLUDE,
			orderBy: {
				price: query
			}
		});
	}

	public async findById(id: bigint) {
		return this.prismaService.provision.findUnique({
			where: { id },
			include: DEFAULT_INCLUDE
		});
	}

	public async findByUser(id: bigint) {
		return this.prismaService.provision.findMany({
			where: { userId: id },
			include: DEFAULT_INCLUDE
		});
	}

	public async findByIdAndFreeSlots(
		provisionId: bigint,
		order: "asc" | "desc"
	) {
		return this.prismaService.provision.findUnique({
			where: { id: provisionId },
			include: {
				user: true,
				category: true,
				slots: {
					where: { isBooking: false },
					orderBy: { time: order }
				}
			}
		});
	}

	public async findByCategoryId(categoryId: bigint) {
		return this.prismaService.provision.findMany({
			where: {
				category: {
					id: categoryId
				}
			},
			include: DEFAULT_INCLUDE
		});
	}

	public async update(data: UpdateData) {
		return this.prismaService.provision.update({
			where: {
				id: data.id
			},
			data: {
				...data
			},
			include: DEFAULT_INCLUDE
		});
	}
}
