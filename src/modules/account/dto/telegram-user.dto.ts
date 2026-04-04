import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class TelegramUserDto {
	@IsNumber(
		{},
		{
			message: validationMessages.number("id")
		}
	)
	@ApiProperty({ example: 123456 })
	id: number;

	@IsString({
		message: validationMessages.string("first_name")
	})
	@ApiProperty({ example: "Alex" })
	first_name: string;

	@IsOptional()
	@IsString({
		message: validationMessages.string("username")
	})
	@ApiProperty({ example: "@dev", required: false })
	username?: string;
}
