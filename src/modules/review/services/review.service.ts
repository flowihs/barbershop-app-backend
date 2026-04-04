import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { Roles } from "@prisma/client";

import { ReviewRepository } from "../repositories/review.repository";

import { AccountService } from "@/src/modules/account/services/account.service";
import { ProvisionRepository } from "@/src/modules/provision/repositories/provision.repository";
import { ProvisionMutationService } from "@/src/modules/provision/services/provision-mutation.service";
import { CreateReviewRequestDto } from "@/src/modules/review/dto/create-review-request.dto";
import { ReviewResponseDto } from "@/src/modules/review/dto/review-response.dto";
import { UpdateReviewRequestDto } from "@/src/modules/review/dto/update-review-request.dto";
import { ReviewMapper } from "@/src/shared/mappers/review.mapper";

@Injectable()
export class ReviewService {
	constructor(
		private readonly reviewRepository: ReviewRepository,
		private readonly provisionRepository: ProvisionRepository,
		private readonly provisionMutationService: ProvisionMutationService,
		private readonly accountService: AccountService
	) {}

	public async create(
		dto: CreateReviewRequestDto
	): Promise<ReviewResponseDto> {
		const createData = {
			title: dto.title,
			description: dto.description,
			rating: dto.rating,
			userId: BigInt(dto.userId),
			provisionId: BigInt(dto.provisionId)
		};

		const review = await this.reviewRepository.create(createData);

		const provisionId: bigint = BigInt(dto.provisionId);

		const provision = await this.provisionRepository.findById(provisionId);

		if (!provision) {
			throw new BadRequestException("Услуга не найдена");
		}

		const ratings = provision.review.map(r => r.rating);

		const averageRating =
			ratings.length > 0
				? ratings.reduce((acc, rating) => acc + rating, 0) /
					ratings.length
				: 0;

		await this.provisionMutationService.updateRating(
			provisionId,
			averageRating
		);

		return ReviewMapper.toResponse(review);
	}

	public async deleteById(id: bigint, userId: bigint) {
		const review = await this.findById(id);
		const user = await this.accountService.findById(userId);

		const userIdByReview = BigInt(review.user.id);

		if (user.role !== Roles.ADMIN || userId !== userIdByReview) {
			throw new BadRequestException(
				"У пользователя нет доступа для удаления отзыва"
			);
		}

		await this.reviewRepository.deleteById(id);

		return {
			status: 200,
			message: "Отзыв был успешно удален"
		};
	}

	public async update(
		dto: UpdateReviewRequestDto,
		userId: bigint
	): Promise<ReviewResponseDto> {
		const user = await this.accountService.findById(BigInt(userId));

		if (BigInt(user.id) !== BigInt(userId) || user.role !== Roles.ADMIN) {
			throw new BadRequestException(
				"Пользователь не имеет доступа к обновлению данного отзыва"
			);
		}

		const updatedData = ReviewMapper.updateData(dto);

		const updatedReview = await this.reviewRepository.update(updatedData);

		return ReviewMapper.toResponse(updatedReview);
	}

	public async findAll(
		order: "asc" | "desc" = "asc"
	): Promise<ReviewResponseDto[]> {
		const reviews = await this.reviewRepository.findAll(order);
		return ReviewMapper.toResponseList(reviews);
	}

	public async findFirstFiveReviewsWithHighRatingByUser(
		userId: bigint
	): Promise<ReviewResponseDto[]> {
		const reviews =
			await this.reviewRepository.findFirstFiveReviewsWithHighRatingByUser(
				userId
			);

		if (!reviews || reviews.length === 0) {
			throw new NotFoundException(
				"Отзывы у данного пользователя не были найдены"
			);
		}

		return ReviewMapper.toResponseList(reviews);
	}

	public async findById(id: bigint) {
		const review = await this.reviewRepository.findById(id);

		if (!review) {
			throw new NotFoundException(`Отзыв с id ${id} не был найден`);
		}

		return ReviewMapper.toResponse(review);
	}

	public async findAllByUser(userId: bigint): Promise<ReviewResponseDto[]> {
		const reviews = await this.reviewRepository.findAllByUser(userId);

		if (!reviews || reviews.length === 0) {
			throw new NotFoundException(
				"Отзывы не были найдены у данного пользователя"
			);
		}

		return ReviewMapper.toResponseList(reviews);
	}
}
