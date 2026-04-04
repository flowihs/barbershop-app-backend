import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class DeleteLikeRequestDto {
	@ApiProperty({
		example: "12345678",
		description: "ID записи о лайке для удаления"
	})
	@IsInt({
		message: validationMessages.int("id")
	})
	@IsNotEmpty({
		message: validationMessages.required("id")
	})
	id: number;
}
