import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

import { validationMessages } from "@/src/shared/utils/validation-messages";

export enum SortOrder {
	ASC = "asc",
	DESC = "desc"
}

export class SortProvisionRequestDto {
	@ApiProperty({
		enum: SortOrder,
		required: false,
		default: SortOrder.ASC,
		description:
			"Направление сортировки: asc - по возрастанию, desc - по убыванию"
	})
	@IsEnum(SortOrder, {
		message: validationMessages.enum("order")
	})
	@IsNotEmpty({
		message: validationMessages.required("order")
	})
	order: SortOrder;
}
