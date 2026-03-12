import { Category, Provision } from "@/generated";
import { CategoryResponseDto } from "@/src/modules/category/dto/category-response.dto";

export class CategoryMapper {
	static toResponse(category: Category): CategoryResponseDto {
		return {
			id: Number(category.id),
			name: category.name
		};
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
}
