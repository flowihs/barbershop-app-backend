import { Module } from "@nestjs/common";

import { CategoryService } from "./services/category.service";
import { CoreModule } from "@/src/core/core.module";
import { CategoryController } from "@/src/modules/category/controllers/category.controller";
import { CategoryRepository } from "@/src/modules/category/repositories/category.repository";

@Module({
	imports: [CoreModule],
	controllers: [CategoryController],
	providers: [CategoryService, CategoryRepository],
	exports: [CategoryService, CategoryRepository]
})
export class CategoryModule {}
