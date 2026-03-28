import { ApiProperty } from "@nestjs/swagger";

import { TelegramProfileDto } from "./telegram-profile.dto";

export class ErrorResponseDto {
	@ApiProperty({ example: false })
	success: boolean;

	@ApiProperty({ example: "Все поля соответствуют текущим" })
	message: string;
}

export type UpdateProfileResponseDto = TelegramProfileDto | ErrorResponseDto;
