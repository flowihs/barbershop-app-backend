import { Module } from "@nestjs/common";

import { CoreModule } from "../../core/core.module";
import { AccountModule } from "../account/account.module";
import { CategoryModule } from "../category/category.module";

import { ProvisionController } from "./controllers/provision.controller";
import { ProvisionRepository } from "./repositories/provision.repository";
import { ProvisionMutationService } from "./services/provision-mutation.service";
import { ProvisionQueryService } from "./services/provision-query.service";

@Module({
	imports: [CoreModule, AccountModule, CategoryModule],
	controllers: [ProvisionController],
	providers: [
		ProvisionQueryService,
		ProvisionMutationService,
		ProvisionRepository
	],
	exports: [
		ProvisionQueryService,
		ProvisionMutationService,
		ProvisionRepository
	]
})
export class ProvisionModule {}
