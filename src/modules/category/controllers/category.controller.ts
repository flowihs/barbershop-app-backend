import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Roles } from "@prisma/client";

import { CategoryResponseDto } from "../dto/category-response.dto";
import { CategoryService } from "../services/category.service";

import { CategoryCreateRequestDto } from "../dto/category-create-request.dto";
import { CategoryCreateResponseDto } from "../dto/category-create-response.dto";
import { Authorization } from "../../../shared/decorators/authorization.decorator";
import { Roles as RolesDecorator } from "../../../shared/decorators/roles.decorator";
import { TelegramAuthGuard } from "../../../shared/guards/auth.guard";
import { RolesGuard } from "../../../shared/guards/roles.guard";
import { ParseBigIntPipe } from "../../../shared/pipes/parse-bigint.pipe";

@Controller("category")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post("create")
	@Authorization()
	@UseGuards(TelegramAuthGuard, RolesGuard)
	@RolesDecorator(Roles.ADMIN)
	public async create(
		@Body() dto: CategoryCreateRequestDto
	): Promise<CategoryCreateResponseDto> {
		return this.categoryService.create(dto);
	}

	@Delete(":id")
	@Authorization()
	@UseGuards(TelegramAuthGuard, RolesGuard)
	@RolesDecorator(Roles.ADMIN)
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
