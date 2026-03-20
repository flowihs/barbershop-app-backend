import { Category, Provision } from "@prisma/client";
import { CategoryCreateResponseDto } from "@/src/modules/category/dto/category-create-response.dto";
import { CategoryResponseDto } from "@/src/modules/category/dto/category-response.dto";

export class CategoryMapper {
	static toResponse(category: Category): CategoryResponseDto {
		return {
			id: Number(category.id),
			name: category.name
		};
	}

	static toReponseList(categories: Array<Category>) {
		return categories.map((category: Category) =>
			this.toResponse(category)
		);
	}

	static toResponseWithProvision(
		category: Category & { provision: Provision[] }
	): CategoryResponseDto {
		return {
			id: Number(category.id),
			name: category.name,
			provision: category.provision.map(prov => ({
				id: Number(prov.id),
				title: prov.title,
				description: prov.description,
				price: prov.price,
				image: prov.image
			}))
		};
	}

	static toCreateResponseDto(category: Category): CategoryCreateResponseDto {
		return {
			id: Number(category.id),
			name: category.name
		};
	}
}
