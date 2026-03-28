import { ApiProperty } from "@nestjs/swagger";

import { TelegramProfileDto } from "../../account/dto/telegram-profile.dto";
import { CategoryResponseDto } from "../../category/dto/category-response.dto";
import { SlotResponseDto } from "../../slot/dto/slot-response.dto";
import { LikeResponseDto } from "../../like/dto/like-response.dto";

export class CreateProvisionResponseDto {
	@ApiProperty({ example: 123, description: "ID услуги" })
	id: number;

	@ApiProperty({ example: "Стрижка", description: "Название услуги" })
	title: string;

	@ApiProperty({ example: "Описание", description: "Описание услуги" })
	description: string;

	@ApiProperty({ example: 55, description: "Цена услуги", minimum: 0 })
	price: number;

	@ApiProperty({
		example: "project/uploads/image-1.jpg",
		description: "URL изображения"
	})
	image: string;

	@ApiProperty({
		type: () => TelegramProfileDto,
		description: "Информация о пользователе"
	})
	user: TelegramProfileDto;

	@ApiProperty({
		type: () => CategoryResponseDto,
		description: "Категория услуги"
	})
	category: CategoryResponseDto;

	@ApiProperty({
		type: () => SlotResponseDto,
		isArray: true,
		description: "Слоты времени"
	})
	slots: SlotResponseDto[];
}
