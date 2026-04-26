import { Module } from "@nestjs/common";

import { CategoryService } from "./services/category.service";
import { CategoryController } from "@/modules/category/controllers/category.controller";
import { CategoryRepository } from "@/modules/category/repositories/category.repository";

@Module({
	controllers: [CategoryController],
	providers: [CategoryService, CategoryRepository],
	exports: [CategoryService, CategoryRepository]
})
export class CategoryModule {}
