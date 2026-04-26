import { Module } from "@nestjs/common";

import { AccountService } from "./services/account.service";
import { CoreModule } from "@/core/core.module";
import { AccountController } from "@/modules/account/controllers/account.controller";
import { AccountRepository } from "@/modules/account/repositories/account.repository";

@Module({
	imports: [CoreModule],
	providers: [AccountService, AccountRepository],
	controllers: [AccountController],
	exports: [AccountService, AccountRepository]
})
export class AccountModule {}
