import { ApiProperty } from "@nestjs/swagger";
import { LikeTargetType } from "@prisma/client";

export class AddLikeResponseDto {
	@ApiProperty({
		example: 1,
		description: "ID созданного лайка"
	})
	id: bigint;

	@ApiProperty({
		example: 123,
		description: "ID пользователя"
	})
	userId: bigint;

	@ApiProperty({
		example: 456,
		description: "ID понравившегося объекта"
	})
	targetId: bigint;

	@ApiProperty({
		example: "PROVISION",
		description: "Тип лайкнутой сущности",
		enum: ["PROVISION", "CATEGORY", "BARBER"]
	})
	targetType: LikeTargetType;

	@ApiProperty({
		example: new Date().toISOString(),
		description: "Дата создания лайка"
	})
	createdAt: Date;
}
