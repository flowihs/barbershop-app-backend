import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { setupSwagger } from "./core/swagger";
import { GlobalExceptionFilter } from "./shared/filters/global-exception.filter";
import { EnvironmentConfigService } from "@/core/config/environment-config.service";

(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

async function bootstrap() {
	const logger = new Logger("Bootstrap");

	try {
		const app = await NestFactory.create(AppModule);
		const config = app.get(ConfigService);
		const envConfig = app.get(EnvironmentConfigService);

		app.useGlobalFilters(new GlobalExceptionFilter());

		app.use(cookieParser(config.getOrThrow<string>("COOKIES_SECRET")));

		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: true,
				errorHttpStatusCode: 422
			})
		);

		setupSwagger(app);

		app.enableCors({
			origin: [config.getOrThrow<string>("ALLOWED_ORIGIN")],
			credentials: true,
			exposedHeaders: ["set-cookie"]
		});

		const port = config.get<number>("APPLICATION_PORT") ?? 3000;
		await app.listen(port);

		// Log environment configuration
		envConfig.logEnvironmentConfig();

		logger.log(`✅ Server running on ${envConfig.appUrl}`);
		logger.log(`📚 Swagger: ${envConfig.appUrl}/swagger`);
	} catch (error) {
		const logger = new Logger("Bootstrap");
		logger.error(
			`Failed to start: ${
				error instanceof Error ? error.message : String(error)
			}`,
			error instanceof Error ? error.stack : ""
		);
		process.exit(1);
	}
}

bootstrap();
