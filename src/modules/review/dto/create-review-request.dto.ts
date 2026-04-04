import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class CreateReviewRequestDto {
	@ApiProperty({
		example: "Не устраивает обслуживание мастера",
		title: "Заголовок отзыва"
	})
	@IsString({
		message: validationMessages.string("title")
	})
	@IsNotEmpty({
		message: validationMessages.required("title")
	})
	title: string;

	@ApiProperty({
		title: "Описание отзыва",
		example: "Порезали ухо во время стрижки"
	})
	@IsString({
		message: validationMessages.string("description")
	})
	@IsNotEmpty({
		message: validationMessages.required("description")
	})
	description: string;

	@ApiProperty({
		example: "4.8",
		title: "Оценка"
	})
	@IsNotEmpty({
		message: validationMessages.required("rating")
	})
	@IsNumber(
		{},
		{
			message: validationMessages.number("rating")
		}
	)
	rating: number;

	@ApiProperty({
		example: "5",
		title: "id пользователя оставившего отзыв"
	})
	@IsNotEmpty({
		message: validationMessages.required("userId")
	})
	@IsInt({
		message: validationMessages.number("userId")
	})
	userId: number;

	@ApiProperty({
		example: "5",
		title: "id обьекта на который оставлен отзыв"
	})
	@IsNotEmpty({
		message: validationMessages.required("provisionId")
	})
	@IsInt({
		message: validationMessages.number("provisionId")
	})
	provisionId: number;
}
