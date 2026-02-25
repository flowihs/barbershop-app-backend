import { Module } from "@nestjs/common";

import { ProvisionController } from "./provision.controller";
import { ProvisionService } from "./provision.service";

@Module({
	controllers: [ProvisionController],
	providers: [ProvisionService]
})
export class ProvisionModule {}
