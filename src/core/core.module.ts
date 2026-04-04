import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EnvironmentConfigService } from "./config/environment-config.service";
import { PrismaModule } from "./prisma/prisma.module";

const envFile =
	process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";

@Module({
	imports: [
		PrismaModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [envFile, ".env"]
		})
	],
	providers: [EnvironmentConfigService],
	exports: [PrismaModule, EnvironmentConfigService]
})
export class CoreModule {}
