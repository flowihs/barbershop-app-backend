import { PrismaService } from "@/src/core/prisma/prisma.service";

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
			include: {
				user: true,
				provision: true
			}
		});
	}
}
