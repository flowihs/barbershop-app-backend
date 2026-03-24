import { Module } from "@nestjs/common";

import { CoreModule } from "@/src/core/core.module";
import { AccountModule } from "@/src/modules/account/account.module";
import { BookingModule } from "@/src/modules/booking/booking.module";
import { CategoryModule } from "@/src/modules/category/category.module";
import { ProvisionModule } from "@/src/modules/provision/provision.module";
import { SlotModule } from "@/src/modules/slot/slot.module";
import { LikeModule } from './modules/like/like.module';

@Module({
	imports: [
		CoreModule,
		AccountModule,
		ProvisionModule,
		CategoryModule,
		SlotModule,
		BookingModule,
		LikeModule,
	]
})
export class AppModule {}
