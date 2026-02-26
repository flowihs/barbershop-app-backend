import { applyDecorators, UseGuards } from "@nestjs/common";

import { TelegramAuthGuard } from "@/src/shared/guards/auth.guard";

export function Authorization() {
	return applyDecorators(UseGuards(TelegramAuthGuard));
}
