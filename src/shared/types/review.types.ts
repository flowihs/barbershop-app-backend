import { Prisma } from "@prisma/client";

export interface UpdateData {
	id: number;
	title?: string;
	description?: string;
	rating?: number;
}

export const reviewPopulated = Prisma.validator<Prisma.ReviewInclude>()({
	user: true,
	provision: {
		include: {
			user: true,
			category: true,
			slots: true,
			review: {
				include: {
					user: true
				}
			}
		}
	}
});

export type ReviewWithRelations = Prisma.ReviewGetPayload<{
	include: typeof reviewPopulated;
}>;
