import { Module } from "@nestjs/common";

import { CategoryService } from "./services/category.service";
import { CoreModule } from "../../core/core.module";
import { CategoryController } from "./controllers/category.controller";
import { CategoryRepository } from "./repositories/category.repository";

@Module({
	imports: [CoreModule],
	controllers: [CategoryController],
	providers: [CategoryService, CategoryRepository],
	exports: [CategoryService, CategoryRepository]
})
export class CategoryModule {}
