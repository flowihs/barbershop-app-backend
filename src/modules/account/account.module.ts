import { Module } from "@nestjs/common";

import { AccountService } from "./account.service";
import { CoreModule } from "@/src/core/core.module";
import { AccountController } from "@/src/modules/account/account.controller";

@Module({
	imports: [CoreModule],
	providers: [AccountService],
	controllers: [AccountController],
	exports: [AccountService]
})
export class AccountModule {}
