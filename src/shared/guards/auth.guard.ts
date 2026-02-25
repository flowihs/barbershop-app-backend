import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";

interface RequestWithTg extends Request {
	tgUser?: TelegramUserDto;
}

@Injectable()
export class TelegramAuthGuard implements CanActivate {
	constructor(private readonly configService: ConfigService) {}

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
			const params = new URLSearchParams(data);

			initData = {
				query_id: params.get("query_id") ?? null,
				auth_date: params.get("auth_date") ?? null,
				hash: params.get("hash") ?? null,
				signature: params.get("signature") ?? null,
				user: params.get("user")
					? JSON.parse(params.get("user")!)
					: null
			};

			console.log("Parsed initData (DEV):", initData);
		} catch (e) {
			console.error("InitData parse error:", e);
			throw new UnauthorizedException("Invalid initData format");
		}

		if (!initData.user) {
			throw new UnauthorizedException("User not found in initData");
		}

		request.tgUser = {
			id: initData.user.id,
			first_name: initData.user.first_name,
			username: initData.user.username
		};

		return true;
	}
}
