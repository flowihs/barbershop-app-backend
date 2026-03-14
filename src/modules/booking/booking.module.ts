import { Module } from "@nestjs/common";

import { BookingController } from "./controllers/booking.controller";
import { BookingService } from "./services/booking.service";
import { CoreModule } from "@/src/core/core.module";
import { BookingRepository } from "@/src/modules/booking/repositories/booking.repository";
import { SlotModule } from "@/src/modules/slot/slot.module";

@Module({
	imports: [CoreModule, SlotModule],
	controllers: [BookingController],
	providers: [BookingService, BookingRepository],
	exports: [BookingService, BookingRepository]
})
export class BookingModule {}
