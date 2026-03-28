import { ApiProperty } from "@nestjs/swagger";

import { TelegramProfileDto } from "../../account/dto/telegram-profile.dto";
import { CategoryResponseDto } from "../../category/dto/category-response.dto";
import { LikeResponseDto } from "../../like/dto/like-response.dto";
import { SlotResponseDto } from "../../slot/dto/slot-response.dto";

export class ProvisionResponseDto {
	@ApiProperty({
		example: 123,
		description: "Уникальный идентификатор услуги"
	})
	id: number;

	@ApiProperty({ example: "Стрижка", description: "Название услуги" })
	title: string;

	@ApiProperty({
		example: "Подробное описание",
		description: "Подробное описание услуги"
	})
	description: string;

	@ApiProperty({ example: 55, description: "Стоимость услуги", minimum: 0 })
	price: number;

	@ApiProperty({
		example: "project/uploads/image-1.jpg",
		description: "URL изображения услуги"
	})
	image: string;

	@ApiProperty({
		type: () => TelegramProfileDto,
		description: "Информация о владельце услуги",
		required: false
	})
	user?: TelegramProfileDto;

	@ApiProperty({
		type: () => CategoryResponseDto,
		description: "Категория услуги",
		required: false
	})
	category?: CategoryResponseDto;

	@ApiProperty({
		type: () => SlotResponseDto,
		isArray: true,
		description: "Список доступных слотов времени",
		required: false
	})
	slots?: SlotResponseDto[];

	@ApiProperty({
		type: LikeResponseDto,
		isArray: false,
		description: "Понравившееся",
		required: false
	})
	like?: LikeResponseDto;
}
