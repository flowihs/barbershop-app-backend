import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export class CreateSlotRequestDto {
	@IsDateString()
	@IsNotEmpty({
		message: validationMessages.required("time")
	})
	time: string;

	@IsNumber(
		{},
		{
			message: validationMessages.number("provisionId")
		}
	)
	@IsNotEmpty({
		message: validationMessages.required("provisionId")
	})
	provisionId: number;
}
