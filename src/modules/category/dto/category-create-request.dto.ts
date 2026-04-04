import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class CategoryCreateRequestDto {
	@IsNotEmpty({
		message: validationMessages.required("name")
	})
	@IsString({
		message: validationMessages.string("name")
	})
	@ApiProperty({ example: "Стрижки" })
	name: string;
}
