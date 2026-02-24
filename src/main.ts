import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { CoreModule } from "./core/core.module";

// import { RedisService } from "@/src/core/redis/redis.service";

async function bootstrap() {
	const app = await NestFactory.create(CoreModule);

	const config = app.get(ConfigService);
	// const redis = app.get(RedisService);

	app.use(cookieParser(config.getOrThrow<string>("COOKIES_SECRET")));

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	);

	app.enableCors({
		origin: config.getOrThrow<string>("ALLOWED_ORIGIN"),
		credentials: true,
		exposedHeaders: ["set-cookie"]
	});

	await app.listen(config.getOrThrow<number>("APPLICATION_PORT") ?? 3000);
}

bootstrap();
