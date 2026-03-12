import { Module } from "@nestjs/common";

import { SlotService } from "./slot.service";
import { CoreModule } from "@/src/core/core.module";

@Module({
	imports: [CoreModule],
	providers: [SlotService],
	exports: [SlotService]
})
export class SlotModule {}
