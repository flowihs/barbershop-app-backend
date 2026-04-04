import { Module } from "@nestjs/common";

import { CoreModule } from "../../core/core.module";
import { AccountModule } from "../account/account.module";

import { LikeController } from "./controllers/like.controller";
import { LikeRepository } from "./repositories/like.repository";
import { LikeService } from "./services/like.service";

@Module({
	controllers: [LikeController],
	providers: [LikeService, LikeRepository],
	imports: [CoreModule, AccountModule]
})
export class LikeModule {}
