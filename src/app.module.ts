import { Module } from "@nestjs/common";

import { CoreModule } from "@/src/core/core.module";
import { AccountModule } from "@/src/modules/account/account.module";
import { CategoryModule } from "@/src/modules/category/category.module";
import { ProvisionModule } from "@/src/modules/provision/provision.module";
import { SlotModule } from "@/src/modules/slot/slot.module";
import { BookingModule } from "@/src/modules/booking/booking.module";

@Module({
	imports: [
		CoreModule,
		AccountModule,
		ProvisionModule,
		CategoryModule,
		SlotModule,
		BookingModule
	]
})
export class AppModule {}
