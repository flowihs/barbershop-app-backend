import { Module } from "@nestjs/common";

import { CoreModule } from "@/src/core/core.module";
import { ProvisionModule } from "@/src/modules/provision/provision.module";
import { ReviewController } from "./controllers/review.controller";
import { ReviewRepository } from "./repositories/review.repository";
import { ReviewService } from "./services/review.service";

@Module({
	imports: [ProvisionModule, CoreModule],
	controllers: [ReviewController],
	providers: [ReviewService, ReviewRepository]
})
export class ReviewModule {}
