import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

import { CoreModule } from "./core/core.module";

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

	const swaggerConfig = new DocumentBuilder()
		.setTitle("Barbershop API")
		.setDescription("API documentation for Barbershop Mini App")
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("swagger", app, swaggerDocument);

	app.enableCors({
		origin: [
			config.getOrThrow<string>("ALLOWED_ORIGIN"),
			"http://localhost:3000",
			"https://equivalent-drink-hockey-happening.trycloudflare.com"
		],
		credentials: true,
		exposedHeaders: ["set-cookie"]
	});

	await app.listen(config.getOrThrow<number>("APPLICATION_PORT") ?? 3000);
}

bootstrap();
