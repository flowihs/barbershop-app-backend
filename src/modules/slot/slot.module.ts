import { Module } from "@nestjs/common";

import { CoreModule } from "../../core/core.module";
import { ProvisionModule } from "../provision/provision.module";

import { SlotRepository } from "./repositories/slot.repository";
import { SlotService } from "./services/slot.service";

@Module({
	imports: [CoreModule, ProvisionModule],
	providers: [SlotService, SlotRepository],
	exports: [SlotService, SlotRepository]
})
export class SlotModule {}
