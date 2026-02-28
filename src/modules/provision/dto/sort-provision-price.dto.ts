import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export enum SortOrder {
	ASC = "asc",
	DESC = "desc"
}

export class SortProvisionPriceDto {
	@ApiProperty({
		enum: SortOrder,
		required: false,
		default: SortOrder.ASC,
		description:
			"Направление сортировки: asc - по возрастанию, desc - по убыванию"
	})
	@IsEnum(SortOrder)
	@IsOptional()
	order?: SortOrder = SortOrder.ASC;
}
