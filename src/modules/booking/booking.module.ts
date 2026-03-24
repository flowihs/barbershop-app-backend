import { Module } from "@nestjs/common";

import { BookingController } from "./controllers/booking.controller";
import { BookingService } from "./services/booking.service";
import { CoreModule } from "@/src/core/core.module";
import { AccountModule } from "@/src/modules/account/account.module";
import { BookingRepository } from "@/src/modules/booking/repositories/booking.repository";
import { ProvisionModule } from "@/src/modules/provision/provision.module";
import { SlotModule } from "@/src/modules/slot/slot.module";

@Module({
	imports: [CoreModule, SlotModule, AccountModule, ProvisionModule],
	controllers: [BookingController],
	providers: [BookingService, BookingRepository],
	exports: [BookingService, BookingRepository]
})
export class BookingModule {}
