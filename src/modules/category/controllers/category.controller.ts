import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { CategoryResponseDto } from "../dto/category-response.dto";
import { CategoryService } from "../services/category.service";

import { CategoryCreateRequestDto } from "@/modules/category/dto/category-create-request.dto";
import { CategoryCreateResponseDto } from "@/modules/category/dto/category-create-response.dto";
import { ParseBigIntPipe } from "@/shared/pipes/parse-bigint.pipe";

@Controller("category")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post("create")
	public async create(
		@Body() dto: CategoryCreateRequestDto
	): Promise<CategoryCreateResponseDto> {
		return this.categoryService.create(dto);
	}

	@Delete(":id")
	public async deleteById(
		@Param("id", ParseBigIntPipe) id: bigint
	): Promise<boolean> {
		return this.categoryService.deleteById(id);
	}

	@Get("")
	public async findAll(): Promise<CategoryResponseDto[]> {
		return this.categoryService.findAll();
	}

	@Get(":id")
	public async findById(
		@Param("id", ParseBigIntPipe) id: bigint
	): Promise<CategoryResponseDto> {
		return this.categoryService.findById(id);
	}
}
