import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import { Request } from "express";

import { EnvironmentConfigService } from "../../core/config/environment-config.service";
import { TelegramUserDto } from "../../modules/account/dto/telegram-user.dto";

interface RequestWithTg extends Request {
	tgUser?: TelegramUserDto;
}

@Injectable()
export class TelegramAuthGuard implements CanActivate {
	constructor(
		private readonly configService: ConfigService,
		private readonly envConfig: EnvironmentConfigService
	) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<RequestWithTg>();

		const authorization = request.headers.authorization ?? "";
		const [type, data] = authorization.split(" ");

		if (type !== "tma" || !data) {
			throw new UnauthorizedException(
				"Missing or invalid Authorization header"
			);
		}

		let initData: Record<string, any> = {};

		try {
			if (this.envConfig.isDevelopment && this.isDevToken(data)) {
				return this.handleDevAuth(request, data);
			}

			const params = new URLSearchParams(data);

			const user = params.get("user");
			const authDate = params.get("auth_date");
			const hash = params.get("hash");
			const queryId = params.get("query_id");

			if (!user || !authDate || !hash) {
				throw new UnauthorizedException(
					"Missing required auth parameters"
				);
			}

			this.validateTelegramSignature(data, hash);

			initData = {
				query_id: queryId,
				auth_date: authDate,
				hash: hash,
				user: JSON.parse(user)
			};
		} catch (e) {
			if (e instanceof UnauthorizedException) {
				throw e;
			}
			throw new UnauthorizedException("Invalid initData format");
		}

		if (!initData.user?.id) {
			throw new UnauthorizedException("User ID not found in initData");
		}

		request.tgUser = {
			id: initData.user.id,
			first_name: initData.user.first_name,
			username: initData.user.username
		};

		return true;
	}

	private isDevToken(token: string): boolean {
		return token === "dev-token" || token === "admin-token";
	}

	private handleDevAuth(request: RequestWithTg, token: string): boolean {
		const userId = token === "admin-token" ? 1 : 123456789;

		request.tgUser = {
			id: userId,
			first_name: "DevUser",
			username: "devuser"
		};

		console.log(
			`🔐 DEV AUTH: Logged in as ${request.tgUser.username} (ID: ${userId})`
		);
		return true;
	}

	private validateTelegramSignature(
		initData: string,
		receivedHash: string
	): void {
		const botToken = this.configService.get<string>("TELEGRAM_BOT_TOKEN");

		if (!botToken) {
			throw new Error("TELEGRAM_BOT_TOKEN not configured");
		}

		const params = new URLSearchParams(initData);
		params.delete("hash");

		const sortedParams = Array.from(params.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, value]) => `${key}=${value}`)
			.join("\n");

		const secretKey = createHmac("sha256", "WebAppData")
			.update(botToken)
			.digest();
		const hash = createHmac("sha256", secretKey)
			.update(sortedParams)
			.digest("hex");

		if (hash !== receivedHash) {
			throw new UnauthorizedException("Invalid Telegram signature");
		}
	}
}
