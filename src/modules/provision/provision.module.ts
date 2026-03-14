import { Module } from "@nestjs/common";

import { ProvisionController } from "./controllers/provision.controller";
import { ProvisionRepository } from "./repositories/provision.repository";
import { CoreModule } from "@/src/core/core.module";
import { AccountModule } from "@/src/modules/account/account.module";
import { CategoryModule } from "@/src/modules/category/category.module";
import { ProvisionMutationService } from "@/src/modules/provision/services/provision-mutation.service";
import { ProvisionQueryService } from "@/src/modules/provision/services/provision-query.service";

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
