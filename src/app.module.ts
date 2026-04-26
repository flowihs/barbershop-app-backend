import { Module } from "@nestjs/common";

import { CoreModule } from "@/core/core.module";
import { AccountModule } from "@/modules/account/account.module";
import { BookingModule } from "@/modules/booking/booking.module";
import { CategoryModule } from "@/modules/category/category.module";
import { ProvisionModule } from "@/modules/provision/provision.module";
import { SlotModule } from "@/modules/slot/slot.module";
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
