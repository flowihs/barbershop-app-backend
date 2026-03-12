import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { SortOrder } from "./sort-provision-price-request.dto";

export class ProvisionFreeSlotsRequestDto {
	@ApiProperty({
		enum: SortOrder,
		required: false,
		default: SortOrder.ASC,
		description:
			"Сортировка слотов по времени (asc - по возрастанию, desc - по убыванию)"
	})
	@IsEnum(SortOrder)
	@IsOptional()
	order?: SortOrder = SortOrder.ASC;
}
