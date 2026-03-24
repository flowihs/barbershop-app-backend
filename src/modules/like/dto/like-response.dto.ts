import { ApiProperty } from "@nestjs/swagger";
import { LikeTargetType } from "@prisma/client";

export class LikeResponseDto {
	@ApiProperty({
		example: "12345678",
		description: "ID лайка"
	})
	id: bigint;

	@ApiProperty({
		example: "123",
		description: "ID пользователя"
	})
	userId: bigint;

	@ApiProperty({
		example: "456",
		description: "ID понравившегося объекта"
	})
	targetId: bigint;

	@ApiProperty({
		example: "PROVISION",
		description: "Тип лайкнутой сущности",
		enum: ["PROVISION"]
	})
	targetType: LikeTargetType;

	@ApiProperty({
		example: new Date().toISOString(),
		description: "Дата создания лайка"
	})
	createdAt: Date;

	@ApiProperty({
		example: new Date().toISOString(),
		description: "Дата последнего обновления лайка"
	})
	updatedAt: Date;
}
