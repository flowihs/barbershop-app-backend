import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export enum SortOrder {
	ASC = "asc",
	DESC = "desc"
}

export class SortProvisionPriceRequestDto {
	@ApiProperty({
		enum: SortOrder,
		required: false,
		default: SortOrder.ASC,
		description:
			"Направление сортировки: asc - по возрастанию, desc - по убыванию"
	})
	@IsEnum(SortOrder)
	@IsNotEmpty()
	order: SortOrder;
}
