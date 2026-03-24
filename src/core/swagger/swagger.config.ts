import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
	const config = new DocumentBuilder()
		.setTitle("Barbershop API")
		.setDescription("API documentation for Barbershop Mini App (Telegram)")
		.setVersion("1.0")
		.addApiKey(
			{
				type: "apiKey",
				name: "Authorization",
				in: "header",
				description:
					"Telegram Mini App authentication. Format: tma query_id=...&user={...}&auth_date=...&hash=..."
			},
			"telegram-auth"
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("swagger", app, document);
}
