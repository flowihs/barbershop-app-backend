import { CategoryMapper } from "./category.mapper";
import { SlotMapper } from "./slot.mapper";
import { UserMapper } from "./user.mapper";
import { Category, Provision, Slot, User } from "@/generated";
import { CreateProvisionResponseDto } from "@/src/modules/provision/dto/create-provision-response.dto";

export class ProvisionMapper {
	static toResponse(
		provision: Provision & {
			user: User;
			category: Category;
			slots: Slot[];
		}
	): CreateProvisionResponseDto {
		return {
			id: Number(provision.id),
			title: provision.title,
			description: provision.description,
			price: provision.price,
			image: provision.image,
			user: UserMapper.toResponse(provision.user),
			category: CategoryMapper.toResponse(provision.category),
			slots: SlotMapper.toResponseList(provision.slots)
		};
	}

	static toResponseList(
		provisions: Array<
			Provision & {
				user: User;
				category: Category;
				slots: Slot[];
			}
		>
	): CreateProvisionResponseDto[] {
		return provisions.map(provision => this.toResponse(provision));
	}
}
