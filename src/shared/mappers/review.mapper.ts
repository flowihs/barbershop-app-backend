import { BadRequestException } from "@nestjs/common";
import { Review, User } from "@prisma/client";

import { ReviewResponseDto } from "@/src/modules/review/dto/review-response.dto";
import { UpdateReviewRequestDto } from "@/src/modules/review/dto/update-review-request.dto";
import { ProvisionMapper } from "@/src/shared/mappers/provision.mapper";
import { UserMapper } from "@/src/shared/mappers/user.mapper";
import { UpdateData } from "@/src/shared/types/review.types";

type ReviewInput = Review & {
	user: User;
	provision?: any;
};

export class ReviewMapper {
	static toResponse(review: ReviewInput): ReviewResponseDto {
		return {
			id: Number(review.id),
			title: review.title,
			description: review.description,
			rating: review.rating,
			user: UserMapper.toResponse(review.user),
			provision: review.provision
				? ProvisionMapper.toResponse(review.provision)
				: undefined
		};
	}

	static toResponseList(reviews?: ReviewInput[]): ReviewResponseDto[] {
		if (!reviews) return [];
		return reviews.map(review => this.toResponse(review));
	}

	static updateData(dto: UpdateReviewRequestDto): UpdateData {
		if (!dto.id) {
			throw new BadRequestException(
				"Для обновления отзыва необходимо указать его id"
			);
		}

		const updatedData: UpdateData = {
			id: dto.id
		};

		if (dto.title) updatedData.title = dto.title;
		if (dto.description) updatedData.description = dto.description;
		if (dto.rating) updatedData.rating = dto.rating;

		if (!dto.title && !dto.description && !dto.rating) {
			throw new BadRequestException("Не указаны поля для обновления");
		}

		return updatedData;
	}
}
