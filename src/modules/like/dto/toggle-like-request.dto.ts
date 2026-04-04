import { ApiProperty } from "@nestjs/swagger";
import { LikeTargetType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class ToggleLikeRequestDto {
	@ApiProperty({
		example: "PROVISION",
		description: "Тип лайкнутой сущности"
	})
	@IsEnum(LikeTargetType)
	@IsNotEmpty({
		message: validationMessages.required("targetType")
	})
	targetType: LikeTargetType;

	@ApiProperty({
		example: "12345678",
		description: "ID понравившегося объекта"
	})
	@IsInt({
		message: validationMessages.int("targetId")
	})
	@IsNotEmpty({
		message: validationMessages.required("targetId")
	})
	targetId: number;
}
