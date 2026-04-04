import { Module } from "@nestjs/common";

import { CoreModule } from "../../core/core.module";

import { AccountController } from "./controllers/account.controller";
import { AccountRepository } from "./repositories/account.repository";
import { AccountService } from "./services/account.service";

@Module({
	imports: [CoreModule],
	providers: [AccountService, AccountRepository],
	controllers: [AccountController],
	exports: [AccountService, AccountRepository]
})
export class AccountModule {}
