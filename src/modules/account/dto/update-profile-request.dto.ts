import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class UpdateProfileRequestDto {
	@IsString({
		message: validationMessages.string("description")
	})
	@IsOptional()
	@ApiProperty({ example: "Начинающий барбер 10 лет", required: false })
	description?: string;

	@IsString({
		message: validationMessages.string("email")
	})
	@IsEmail(
		{},
		{
			message: validationMessages.email("email")
		}
	)
	@IsOptional()
	@ApiProperty({ example: "barber@gmail.com", required: false })
	email?: string;
}
