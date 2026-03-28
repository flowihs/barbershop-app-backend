import { Module } from "@nestjs/common";

import { LikeModule } from "./modules/like/like.module";
import { ReviewModule } from "@/src/modules/review/review.module";
import { CoreModule } from "@/src/core/core.module";
import { AccountModule } from "@/src/modules/account/account.module";
import { BookingModule } from "@/src/modules/booking/booking.module";
import { CategoryModule } from "@/src/modules/category/category.module";
import { ProvisionModule } from "@/src/modules/provision/provision.module";
import { SlotModule } from "@/src/modules/slot/slot.module";

@Module({
	imports: [
		CoreModule,
		AccountModule,
		ProvisionModule,
		CategoryModule,
		SlotModule,
		BookingModule,
		LikeModule,
		ReviewModule
	]
})
export class AppModule {}
