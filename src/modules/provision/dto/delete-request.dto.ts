import { IsNotEmpty, IsNumber } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class DeleteRequestDto {
	@IsNumber({}, { message: validationMessages.int("userId") })
	@IsNotEmpty({ message: validationMessages.required("userId") })
	userId: number;
}
