import { Like } from "@prisma/client";
import { LikeResponseDto } from "@/src/modules/like/dto/like-response.dto";

export class LikeMapper {
	static toResponse(like: Like): LikeResponseDto {
		return {
			id: like.id,
			userId: like.userId,
			targetId: like.targetId,
			targetType: like.targetType,
			createdAt: like.createdAt,
			updatedAt: like.updatedAt
		};
	}

	static toResponseList(likes: Like[]): LikeResponseDto[] {
		return likes.map(like => this.toResponse(like));
	}

	static toJson(like: Like): object {
		return {
			id: Number(like.id),
			userId: Number(like.userId),
			targetId: Number(like.targetId),
			targetType: like.targetType,
			createdAt: like.createdAt.toISOString(),
			updatedAt: like.updatedAt.toISOString()
		};
	}
}
