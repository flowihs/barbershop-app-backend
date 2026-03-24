import { ApiProperty } from "@nestjs/swagger";

export class ToggleLikeResponseDto {
	@ApiProperty({
		example: true,
		description: "Статус лайка: true если лайк добавлен, false если удален"
	})
	liked: boolean;
}
