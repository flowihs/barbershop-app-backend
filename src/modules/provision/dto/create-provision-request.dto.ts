import { ApiProperty } from "@nestjs/swagger";
import {
	IsArray,
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsString,
	Min
} from "class-validator";

import { validationMessages } from "../../../shared/utils/validation-messages";

export class CreateProvisionRequestDto {
	@ApiProperty({
		example: "Стрижка",
		description: "Название услуги",
		minLength: 1,
		maxLength: 100
	})
	@IsNotEmpty({ message: validationMessages.required("title") })
	@IsString({ message: validationMessages.string("title") })
	title: string;

	@ApiProperty({
		example: "Классическая мужская стрижка",
		description: "Описание услуги",
		maxLength: 1000
	})
	@IsNotEmpty({ message: validationMessages.required("description") })
	@IsString({ message: validationMessages.string("description") })
	description: string;

	@ApiProperty({
		example: 55,
		description: "Цена услуги",
		minimum: 0,
		maximum: 1000
	})
	@IsNotEmpty({ message: validationMessages.required("price") })
	@IsNumber({}, { message: validationMessages.number("price") })
	@Min(0)
	price: number;

	@ApiProperty({
		example: ["2024-01-20T10:00:00Z", "2024-01-20T11:00:00Z"],
		description: "Доступное время для записи",
		type: [String],
		minItems: 1
	})
	@IsNotEmpty({ message: validationMessages.required("time") })
	@IsArray({ message: validationMessages.array("time") })
	@IsDateString(
		{},
		{
			each: true,
			message: validationMessages.date("time")
		}
	)
	time: string[];

	@ApiProperty({
		example: 5,
		description: "ID категории услуги",
		minimum: 1
	})
	@IsNotEmpty({ message: validationMessages.required("categoryId") })
	@IsInt({ message: validationMessages.int("categoryId") })
	categoryId: number;

	@ApiProperty({
		example: "uploads/image.jpg",
		description: "URL изображения услуги"
	})
	@IsNotEmpty({ message: validationMessages.required("image") })
	@IsString({ message: validationMessages.string("image") })
	image: string;
}
