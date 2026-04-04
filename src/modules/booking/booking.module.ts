import { Module } from "@nestjs/common";

import { CoreModule } from "../../core/core.module";
import { AccountModule } from "../account/account.module";
import { ProvisionModule } from "../provision/provision.module";
import { SlotModule } from "../slot/slot.module";

import { BookingController } from "./controllers/booking.controller";
import { BookingRepository } from "./repositories/booking.repository";
import { BookingService } from "./services/booking.service";

@Module({
	imports: [CoreModule, SlotModule, AccountModule, ProvisionModule],
	controllers: [BookingController],
	providers: [BookingService, BookingRepository],
	exports: [BookingService, BookingRepository]
})
export class BookingModule {}
