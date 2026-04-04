import { ApiProperty } from "@nestjs/swagger";

import { ProvisionResponseDto } from "../../provision/dto/provision-response.dto";

import { TelegramProfileDto } from "@/src/modules/account/dto/telegram-profile.dto";

export class ReviewResponseDto {
	@ApiProperty({
		title: "id",
		example: 12345
	})
	id: number;

	@ApiProperty({
		title: "title",
		example: "Плохая стрижка"
	})
	title: string;

	@ApiProperty({
		title: "description",
		example: "Поранили ухо во время стрижки"
	})
	description: string;

	@ApiProperty({
		title: "rating",
		example: 4.5
	})
	rating: number;

	@ApiProperty({
		title: "Пользователь",
		type: () => TelegramProfileDto
	})
	user: TelegramProfileDto;

	@ApiProperty({
		type: () => ProvisionResponseDto,
		description: "Услуга, к которой оставлен отзыв",
		required: false
	})
	provision?: ProvisionResponseDto;
}
