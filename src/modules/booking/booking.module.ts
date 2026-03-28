import { Module } from "@nestjs/common";

import { BookingController } from "./controllers/booking.controller";
import { BookingService } from "./services/booking.service";
import { CoreModule } from "../../core/core.module";
import { AccountModule } from "../account/account.module";
import { BookingRepository } from "./repositories/booking.repository";
import { ProvisionModule } from "../provision/provision.module";
import { SlotModule } from "../slot/slot.module";

@Module({
	imports: [CoreModule, SlotModule, AccountModule, ProvisionModule],
	controllers: [BookingController],
	providers: [BookingService, BookingRepository],
	exports: [BookingService, BookingRepository]
})
export class BookingModule {}
