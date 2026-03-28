import { ApiProperty } from "@nestjs/swagger";

import { ProvisionResponseDto } from "../../provision/dto/provision-response.dto";

export class CategoryResponseDto {
	@ApiProperty({ example: "123" })
	id: number;

	@ApiProperty({ example: "Стрижки" })
	name: string;

	@ApiProperty({ example: ProvisionResponseDto })
	provision?: ProvisionResponseDto[];
}
