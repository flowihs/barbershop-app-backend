import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "@/src/core/prisma/prisma.module";
import { RedisModule } from "@/src/core/redis/redis.module";

@Module({
	imports: [
		PrismaModule,
		ConfigModule.forRoot({ isGlobal: true }),
		RedisModule
	],
	exports: [PrismaModule, RedisModule]
})
export class CoreModule {}
