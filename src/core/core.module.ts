import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "@/core/prisma/prisma.module";
import { EnvironmentConfigService } from "@/core/config/environment-config.service";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";

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
