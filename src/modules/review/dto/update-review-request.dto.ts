import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class UpdateReviewRequestDto {
	@ApiProperty({
		required: true,
		title: "id",
		description: "ID отзыва",
		example: "12345678"
	})
	@IsInt({
		message: validationMessages.int("id")
	})
	@IsNotEmpty({
		message: validationMessages.required("id")
	})
	id: number;

	@ApiProperty({
		required: true,
		title: "title",
		description: "Заголовок отзыва",
		example: "Плохое сервис"
	})
	@IsString({
		message: validationMessages.string("title")
	})
	@IsNotEmpty({
		message: validationMessages.required("title")
	})
	title: string;

	@ApiProperty({
		required: true,
		title: "description",
		description: "Описание отзыва",
		example: "Поранили ухо во время стрижки"
	})
	@IsString({
		message: validationMessages.string("description")
	})
	@IsNotEmpty({
		message: validationMessages.required("description")
	})
	description: string;

	@ApiProperty({
		required: true,
		title: "rating",
		description: "Рейтинг отзыва",
		example: "4.5"
	})
	@IsNumber(
		{},
		{
			message: validationMessages.number("rating")
		}
	)
	@IsNotEmpty({
		message: validationMessages.required("rating")
	})
	rating: number;
}
