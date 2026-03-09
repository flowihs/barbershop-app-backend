import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/src/core/prisma/prisma.service";

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
					connect: {
						id: categoryId
					}
				},
				user: {
					connect: {
						id: userId
					}
				},
				slots: {
					create: slotsData
				}
			},
			include: {
				category: true,
				user: true,
				slots: true
			}
		});
	}

	public async deleteById(id: bigint) {
		return this.prismaService.provision.delete({
			where: {
				id
			}
		});
	}

	public async deleteByUserId(userId: bigint) {
		return this.prismaService.provision.deleteMany({
			where: {
				userId: userId
			}
		});
	}

	public async findAll() {
		return this.prismaService.provision.findMany({
			include: {
				user: true,
				category: true,
				slots: {
					orderBy: {
						time: "asc"
					}
				}
			}
		});
	}

	public async findAllSortedByPrice(query: "asc" | "desc") {
		return this.prismaService.provision.findMany({
			include: {
				user: true,
				category: true,
				slots: {
					orderBy: {
						time: "asc"
					}
				}
			},
			orderBy: {
				price: query
			}
		});
	}

	public async findById(id: bigint) {
		return this.prismaService.provision.findUnique({
			where: {
				id: id
			},
			include: {
				user: true,
				category: true,
				slots: {
					orderBy: {
						time: "asc"
					}
				}
			}
		});
	}

	public async findByUser(id: bigint) {
		return this.prismaService.provision.findMany({
			where: {
				userId: id
			},
			include: {
				user: true,
				category: true,
				slots: {
					orderBy: {
						time: "asc"
					}
				}
			}
		});
	}

	public async findByIdAndFreeSlots(
		provisionId: bigint,
		order: "asc" | "desc"
	) {
		return this.prismaService.provision.findMany({
			where: {
				id: provisionId
			},
			include: {
				user: true,
				category: true,
				slots: {
					where: {
						isBooking: false
					},
					orderBy: {
						time: order
					}
				}
			}
		});
	}
}
