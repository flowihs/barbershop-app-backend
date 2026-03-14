import { Body, Controller, Post } from "@nestjs/common";

import { CategoryService } from "../services/category.service";

import { CategoryCreateRequestDto } from "@/src/modules/category/dto/category-create-request.dto";
import { CategoryCreateResponseDto } from "@/src/modules/category/dto/category-create-response.dto";

@Controller("category")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post("create")
	public async create(
		@Body() dto: CategoryCreateRequestDto
	): Promise<CategoryCreateResponseDto> {
		return this.categoryService.create(dto);
	}
}
