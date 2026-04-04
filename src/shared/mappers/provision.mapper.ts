import { Category, Provision, Review, Slot, User } from "@prisma/client";

import { ProvisionResponseDto } from "../../modules/provision/dto/provision-response.dto";
import { UpdateProvisionRequestDto } from "../../modules/provision/dto/update-provision-request.dto";
import { UpdateData } from "../types/provision.types";

import { CategoryMapper } from "./category.mapper";
import { ReviewMapper } from "./review.mapper";
import { SlotMapper } from "./slot.mapper";
import { UserMapper } from "./user.mapper";

export class ProvisionMapper {
	static toResponse(
		provision: Provision & {
			user: User;
			category: Category;
			slots: Slot[];
			review?: (Review & {
				user: User;
			})[];
		}
	): ProvisionResponseDto {
		return {
			id: Number(provision.id),
			title: provision.title,
			description: provision.description,
			price: provision.price,
			image: provision.image,
			user: UserMapper.toResponse(provision.user),
			category: CategoryMapper.toResponse(provision.category),
			slots: SlotMapper.toResponseList(provision.slots),
			reviews: ReviewMapper.toResponseList(provision.review)
		};
	}

	static toResponseList(
		provisions: Array<
			Provision & {
				user: User;
				category: Category;
				slots: Slot[];
				review: (Review & { user: User })[];
			}
		>
	): ProvisionResponseDto[] {
		if (!provisions) return [];
		return provisions.map(provision => this.toResponse(provision));
	}

	static toSlotsCreateData(
		timeStrings: string[]
	): Array<{ time: Date; isBooking: boolean }> {
		const now = new Date();
		const uniqueTimes = new Set<string>();
		const slotsData: Array<{ time: Date; isBooking: boolean }> = [];

		for (const timeStr of timeStrings) {
			const slotDate = new Date(timeStr);

			if (slotDate < now) {
				throw new Error("Вы не можете создать слот в прошлом");
			}

			if (uniqueTimes.has(timeStr)) {
				throw new Error("Время в слоте должно быть уникальным");
			}

			uniqueTimes.add(timeStr);
			slotsData.push({ time: slotDate, isBooking: false });
		}

		return slotsData;
	}

	static toUpdateData(dto: UpdateProvisionRequestDto): UpdateData {
		const updateData: UpdateData = {
			id: dto.id
		};

		if (dto.title) updateData.title = dto.title;
		if (dto.description) updateData.description = dto.description;
		if (dto.price) updateData.price = dto.price;
		if (dto.image) updateData.image = dto.image;

		return updateData;
	}
}
