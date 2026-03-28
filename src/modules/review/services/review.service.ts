import { Injectable } from "@nestjs/common";

import { ProvisionQueryService } from "@/src/modules/provision/services/provision-query.service";
// import { CreateReviewRequestDto } from "@/src/modules/review/dto/create-review-request.dto";
import { ReviewRepository } from "@/src/modules/review/repositories/review.repository";

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
