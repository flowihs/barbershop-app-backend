import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { CoreModule } from "./core/core.module";
import { setupSwagger } from "@/src/core/swagger";

(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

async function bootstrap() {
	const app = await NestFactory.create(CoreModule);

	const config = app.get(ConfigService);

	app.use(cookieParser(config.getOrThrow<string>("COOKIES_SECRET")));

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: false
		})
	);

	setupSwagger(app);

	app.enableCors({
		origin: [config.getOrThrow<string>("ALLOWED_ORIGIN")],
		credentials: true,
		exposedHeaders: ["set-cookie"]
	});

	await app.listen(config.getOrThrow<number>("APPLICATION_PORT") ?? 3000);
}

bootstrap();
