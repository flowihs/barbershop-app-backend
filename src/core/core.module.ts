import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { IS_DEV_ENV } from "@/src/shared/utils/is-dev.util";

@Module({
	imports: [
		PrismaModule,
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		RedisModule
	],
	controllers: [],
	providers: []
})
export class CoreModule {}
