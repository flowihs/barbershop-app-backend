import { ApiProperty } from "@nestjs/swagger";
import { LikeTargetType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class ToggleLikeRequestDto {
	@ApiProperty({
		example: "PROVISION",
		description: "Тип лайкнутой сущности"
	})
	@IsEnum(LikeTargetType)
	@IsNotEmpty()
	targetType: LikeTargetType;

	@ApiProperty({
		example: "12345678",
		description: "ID понравившегося объекта"
	})
	@IsInt()
	@IsNotEmpty()
	targetId: number;
}
