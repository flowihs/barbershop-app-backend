import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvironmentConfigService {
	constructor(private readonly configService: ConfigService) {}

	get environment(): "development" | "production" {
		const env = this.configService.get<string>("NODE_ENV", "development");
		return env === "production" ? "production" : "development";
	}

	get isDevelopment(): boolean {
		return this.environment === "development";
	}

	get isProduction(): boolean {
		return this.environment === "production";
	}

	get isVercel(): boolean {
		return this.configService.get<boolean>("VERCEL", false);
	}

	get appUrl(): string {
		if (this.isProduction) {
			const vercelUrl = this.configService.get<string>("VERCEL_URL");
			if (vercelUrl) {
				return `https://${vercelUrl}`;
			}
		}
		const port = this.configService.get<number>("APPLICATION_PORT", 3000);
		const origin = this.configService.get<string>("ALLOWED_ORIGIN");
		return origin || `http://localhost:${port}`;
	}

	get allowedOrigin(): string {
		return this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
	}

	logEnvironmentConfig(): void {
		console.log(`
╔════════════════════════════════════════════════════════════╗
║         ENVIRONMENT CONFIGURATION                          ║
╠════════════════════════════════════════════════════════════╣
║ Environment: ${this.environment.toUpperCase().padEnd(45)}║
║ Development: ${String(this.isDevelopment).padEnd(45)}║
║ Production: ${String(this.isProduction).padEnd(46)}║
║ Vercel: ${String(this.isVercel).padEnd(52)}║
║ App URL: ${this.appUrl.padEnd(48)}║
║ CORS Origin: ${this.allowedOrigin.padEnd(44)}║
╚════════════════════════════════════════════════════════════╝
		`);
	}
}
