import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
	const config = new DocumentBuilder()
		.setTitle("Barbershop API")
		.setDescription("API documentation for Barbershop Mini App")
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("swagger", app, document);
}
