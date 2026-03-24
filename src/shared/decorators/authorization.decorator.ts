import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiHeader, ApiSecurity } from "@nestjs/swagger";

import { TelegramAuthGuard } from "@/src/shared/guards/auth.guard";

export function Authorization() {
	return applyDecorators(
		UseGuards(TelegramAuthGuard),
		ApiSecurity("telegram-auth"),
		ApiHeader({
			name: "Authorization",
			description: "Telegram Mini App authentication token",
			required: true,
			example:
				"tma query_id=test&user={\"id\":123456}&auth_date=1234567890&hash=abc123"
		})
	);
}
