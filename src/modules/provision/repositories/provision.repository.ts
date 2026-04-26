import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/core/prisma/prisma.service";
import { UpdateData } from "@/shared/types/provision.types";

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

	public async findAllSortedByUpdatedAt(order: "asc" | "desc") {
		return this.prismaService.provision.findMany({
			include: DEFAULT_INCLUDE,
			orderBy: {
				updatedAt: order
			}
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

	public async createWithTransaction(
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
		return this.prismaService.$transaction(async tx => {
			const category = await tx.category.findUnique({
				where: { id: categoryId }
			});

			if (!category) {
				throw new Error(`Category with ID ${categoryId} not found`);
			}

			const user = await tx.user.findUnique({
				where: { id: userId }
			});

			if (!user) {
				throw new Error(`User with ID ${userId} not found`);
			}

			return tx.provision.create({
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
		});
	}

	public async deleteByIdWithTransaction(id: bigint) {
		return this.prismaService.$transaction(async tx => {
			const activeBookings = await tx.booking.findMany({
				where: {
					slot: {
						provisionId: id
					},
					status: {
						in: ["CONFIRMED", "NO_SHOW"]
					}
				}
			});

			if (activeBookings.length > 0) {
				throw new Error("Cannot delete provision with active bookings");
			}

			await tx.booking.deleteMany({
				where: {
					slot: {
						provisionId: id
					}
				}
			});

			return tx.provision.delete({
				where: { id }
			});
		});
	}

	public async deleteByUserIdWithTransaction(userId: bigint) {
		return this.prismaService.$transaction(async tx => {
			const provisions = await tx.provision.findMany({
				where: { userId }
			});

			if (!provisions.length) {
				throw new Error("User has no provisions to delete");
			}

			const provisionIds = provisions.map(p => p.id);

			const activeBookings = await tx.booking.findMany({
				where: {
					slot: {
						provisionId: {
							in: provisionIds
						}
					},
					status: {
						in: ["CONFIRMED", "NO_SHOW"]
					}
				}
			});

			if (activeBookings.length > 0) {
				throw new Error(
					"Cannot delete provisions with active bookings"
				);
			}

			await tx.booking.deleteMany({
				where: {
					slot: {
						provisionId: {
							in: provisionIds
						}
					}
				}
			});

			return tx.provision.deleteMany({
				where: { userId }
			});
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
