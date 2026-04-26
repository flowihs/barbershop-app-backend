import { Module } from "@nestjs/common";

import { SlotService } from "./services/slot.service";
import { CoreModule } from "@/core/core.module";
import { ProvisionModule } from "@/modules/provision/provision.module";
import { SlotRepository } from "@/modules/slot/repositories/slot.repository";

@Module({
	imports: [CoreModule, ProvisionModule],
	providers: [SlotService, SlotRepository],
	exports: [SlotService, SlotRepository]
})
export class SlotModule {}
