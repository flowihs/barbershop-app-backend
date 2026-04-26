import { Module } from "@nestjs/common";

import { BookingController } from "./controllers/booking.controller";
import { BookingService } from "./services/booking.service";
import { CoreModule } from "@/core/core.module";
import { AccountModule } from "@/modules/account/account.module";
import { BookingRepository } from "@/modules/booking/repositories/booking.repository";
import { ProvisionModule } from "@/modules/provision/provision.module";
import { SlotModule } from "@/modules/slot/slot.module";

@Module({
	imports: [CoreModule, SlotModule, AccountModule, ProvisionModule],
	controllers: [BookingController],
	providers: [BookingService, BookingRepository],
	exports: [BookingService, BookingRepository]
})
export class BookingModule {}
