import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

import { RedisService } from "./redis.service";

@Global()
@Module({
	providers: [RedisService],
	exports: [RedisService]
})
export class RedisModule extends Redis {
	public constructor(private readonly configService: ConfigService) {
		super(configService.getOrThrow<string>("REDIS_URI"));
	}
}
