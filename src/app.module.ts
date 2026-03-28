import { Module } from "@nestjs/common";

import { LikeModule } from "./modules/like/like.module";
import { ReviewModule } from "./modules/review/review.module";
import { CoreModule } from "./core/core.module";
import { AccountModule } from "./modules/account/account.module";
import { BookingModule } from "./modules/booking/booking.module";
import { CategoryModule } from "./modules/category/category.module";
import { ProvisionModule } from "./modules/provision/provision.module";
import { SlotModule } from "./modules/slot/slot.module";

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
