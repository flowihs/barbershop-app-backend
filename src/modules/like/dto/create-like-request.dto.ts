import { ApiProperty } from "@nestjs/swagger";
import { LikeTargetType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class CreateLikeRequestDto {
	@ApiProperty({
		example: "PROVISION",
		description: "Тип лайкнутой сущности"
	})
	@IsEnum(LikeTargetType)
	@IsNotEmpty()
	targetType: LikeTargetType;

	@ApiProperty({
		example: "12345678",
		description: "ID понравившегося обьекта"
	})
	@IsInt()
	@IsNotEmpty()
	targetId: number;
}
