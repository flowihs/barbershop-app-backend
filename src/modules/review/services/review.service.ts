import { Injectable } from "@nestjs/common";

import { ProvisionQueryService } from "../../provision/services/provision-query.service";
// import { CreateReviewRequestDto } from "../dto/create-review-request.dto";
import { ReviewRepository } from "../repositories/review.repository";

@Injectable()
export class ReviewService {
	constructor(
		private readonly reviewRepository: ReviewRepository,
		private readonly provisionService: ProvisionQueryService
	) {}

	// public async create(dto: CreateReviewRequestDto) {
	// 	const provisionId: bigint = BigInt(dto.provisionId);
	// 	const provision = await this.provisionService.findById(provisionId);
	//
	//
	// }
}
