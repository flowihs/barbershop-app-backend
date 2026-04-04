import { PrismaService } from "@/src/core/prisma/prisma.service";
import { reviewPopulated, UpdateData } from "@/src/shared/types/review.types";

export class ReviewRepository {
	constructor(private readonly prismaService: PrismaService) {}

	public async create(createData: {
		title: string;
		description: string;
		rating: number;
		userId: bigint;
		provisionId: bigint;
	}) {
		return this.prismaService.review.create({
			data: {
				title: createData.title,
				description: createData.description,
				rating: createData.rating,
				user: {
					connect: {
						id: createData.userId
					}
				},
				provision: {
					connect: {
						id: createData.provisionId
					}
				}
			},
			include: reviewPopulated
		});
	}

	public async findById(id: bigint) {
		return this.prismaService.review.findUnique({
			where: {
				id: id
			},
			include: reviewPopulated
		});
	}

	public async deleteById(id: bigint) {
		return this.prismaService.review.delete({
			where: {
				id: id
			}
		});
	}

	public async findAll(order: "asc" | "desc") {
		return this.prismaService.review.findMany({
			include: reviewPopulated,
			orderBy: {
				createdAt: order
			}
		});
	}

	public async findFirstFiveReviewsWithHighRatingByUser(userId: bigint) {
		return this.prismaService.review.findMany({
			where: {
				provision: {
					user: {
						id: userId
					}
				}
			},
			include: reviewPopulated,
			orderBy: {
				rating: "desc"
			},
			take: 5
		});
	}

	public async update(data: UpdateData) {
		return this.prismaService.review.update({
			where: { id: data.id },
			data: {
				title: data.title,
				description: data.description,
				rating: data.rating
			},
			include: reviewPopulated
		});
	}

	public async findAllByUser(userId: bigint) {
		return this.prismaService.review.findMany({
			where: {
				provision: {
					user: {
						id: userId
					}
				}
			},
			include: reviewPopulated
		});
	}
}
