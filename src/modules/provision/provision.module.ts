import { Module } from "@nestjs/common";

import { ProvisionController } from "./controllers/provision.controller";
import { ProvisionRepository } from "./repositories/provision.repository";
import { CoreModule } from "@/core/core.module";
import { AccountModule } from "@/modules/account/account.module";
import { CategoryModule } from "@/modules/category/category.module";
import { ProvisionMutationService } from "@/modules/provision/services/provision-mutation.service";
import { ProvisionQueryService } from "@/modules/provision/services/provision-query.service";

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
