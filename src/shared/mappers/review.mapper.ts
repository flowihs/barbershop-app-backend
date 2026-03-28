import { Provision, Review, User } from "@prisma/client";

export class ReviewMapper {
	static toResponse(
		review: Review & {
			user: User;
			provision: Provision;
		}
	) {
		return {
			id: Number(review.id),
			title: review.title,
			description: review.description,
			rating: review.rating
		};
	}
}
