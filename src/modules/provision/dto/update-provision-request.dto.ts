import { ApiProperty } from "@nestjs/swagger";
import {
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class UpdateProvisionRequestDto {
	@IsNotEmpty({
		message: validationMessages.required("id")
	})
	@IsInt({
		message: validationMessages.int("id")
	})
	@ApiProperty({
		example: "123",
		title: "id услуги"
	})
	id: number;

	@IsOptional()
	@IsString({
		message: validationMessages.string("title")
	})
	@ApiProperty({
		example: "Стрижка короткая",
		title: "Название услуги"
	})
	title?: string;

	@IsOptional()
	@IsString({
		message: validationMessages.string("description")
	})
	@ApiProperty({
		example: "Классическая мужская стрижка для мужчин любых возрастов",
		title: "Описание услуги"
	})
	description?: string;

	@IsNumber(
		{},
		{
			message: validationMessages.number("price")
		}
	)
	@IsNotEmpty({
		message: validationMessages.required("price")
	})
	@ApiProperty({
		example: "12",
		title: "Стоимость услуги"
	})
	price?: number;

	@IsString({
		message: validationMessages.string("image")
	})
	@IsOptional()
	@ApiProperty({
		example: "project/uploads/image-1.jpg",
		title: "Изображение услуги",
		required: false
	})
	image?: string;
}
