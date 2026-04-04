import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query
} from "@nestjs/common";

import { ReviewService } from "../services/review.service";

import { CreateReviewRequestDto } from "@/src/modules/review/dto/create-review-request.dto";
import { UpdateReviewRequestDto } from "@/src/modules/review/dto/update-review-request.dto";
import { ParseBigIntPipe } from "@/src/shared/pipes/parse-bigint.pipe";

@Controller("review")
export class ReviewController {
	constructor(private readonly reviewsService: ReviewService) {}

	@Get(":id")
	public async findById(@Param("id", ParseBigIntPipe) id: bigint) {
		return this.reviewsService.findById(id);
	}

	@Get()
	public async findByAll(@Query("order") order: "asc" | "desc") {
		return this.reviewsService.findAll(order);
	}

	@Get("barber/:barberId")
	public async findFirstFiveReviewsWithHighRatingByUser(
		@Param("barberId", ParseBigIntPipe) userId: bigint
	) {
		return this.reviewsService.findFirstFiveReviewsWithHighRatingByUser(
			userId
		);
	}

	@Get(":id")
	@Delete(":id")
	public async deleteById(
		@Param("id", ParseBigIntPipe) id: bigint,
		@Body() userId: number
	) {
		return this.reviewsService.deleteById(id, BigInt(userId));
	}

	@Get("barber/all/:barberId")
	public async findAllByUser(
		@Param("barberId", ParseBigIntPipe) userId: bigint
	) {
		return this.reviewsService.findAllByUser(userId);
	}

	@Post("create")
	public async create(@Body() dto: CreateReviewRequestDto) {
		return this.reviewsService.create(dto);
	}

	@Put("update")
	public async update(
		@Body() dto: UpdateReviewRequestDto,
		@Body() userId: number
	) {
		return this.reviewsService.update(dto, BigInt(userId));
	}
}
