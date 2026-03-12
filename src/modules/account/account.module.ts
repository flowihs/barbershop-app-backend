import { Module } from "@nestjs/common";

import { AccountService } from "./account.service";
import { CoreModule } from "@/src/core/core.module";
import { AccountController } from "@/src/modules/account/account.controller";
import { AccountRepository } from "@/src/modules/account/repositories/account.repository";

@Module({
	imports: [CoreModule],
	providers: [AccountService, AccountRepository],
	controllers: [AccountController],
	exports: [AccountService, AccountRepository]
})
export class AccountModule {}
