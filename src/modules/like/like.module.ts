import { Module } from "@nestjs/common";

import { LikeController } from "./controllers/like.controller";
import { LikeService } from "./services/like.service";
import { CoreModule } from "../../core/core.module";
import { AccountModule } from "../account/account.module";
import { LikeRepository } from "./repositories/like.repository";

@Module({
	controllers: [LikeController],
	providers: [LikeService, LikeRepository],
	imports: [CoreModule, AccountModule]
})
export class LikeModule {}
