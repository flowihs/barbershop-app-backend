import { Injectable } from "@nestjs/common";
import { LikeTargetType } from "@prisma/client";

import { PrismaService } from "@/src/core/prisma/prisma.service";

@Injectable()
export class LikeRepository {
	constructor(private readonly prismaService: PrismaService) {}

	public async create(data: {
		userId: bigint;
		targetType: LikeTargetType;
		targetId: bigint;
	}) {
		return this.prismaService.like.create({
			data: {
				user: {
					connect: {
						id: data.userId
					}
				},
				targetType: data.targetType,
				targetId: data.targetId
			}
		});
	}

	public async findById(id: bigint) {
		return this.prismaService.like.findUnique({
			where: {
				id: id
			}
		});
	}

	public async findByTargetIdAndUserId(targetId: bigint, userId: bigint) {
		return this.prismaService.like.findFirst({
			where: {
				userId: userId,
				targetId: targetId
			}
		});
	}

	public async deleteById(id: bigint) {
		return this.prismaService.like.delete({
			where: {
				id: id
			}
		});
	}

	public async deleteByTargetIdAndUserId(targetId: bigint, userId: bigint) {
		return this.prismaService.like.deleteMany({
			where: {
				targetId: targetId,
				userId: userId
			}
		});
	}
}
