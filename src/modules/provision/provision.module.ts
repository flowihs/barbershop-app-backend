import { Module } from "@nestjs/common";

import { ProvisionController } from "./controllers/provision.controller";
import { ProvisionRepository } from "./repositories/provision.repository";
import { ProvisionService } from "./services/provision.service";
import { CoreModule } from "@/src/core/core.module";
import { AccountModule } from "@/src/modules/account/account.module";
import { CategoryModule } from "@/src/modules/category/category.module";
import { SlotModule } from "@/src/modules/slot/slot.module";

@Module({
	imports: [CoreModule, AccountModule, SlotModule, CategoryModule],
	controllers: [ProvisionController],
	providers: [ProvisionService, ProvisionRepository],
	exports: [ProvisionService]
})
export class ProvisionModule {}
