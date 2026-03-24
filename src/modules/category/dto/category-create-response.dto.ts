import { ApiProperty } from "@nestjs/swagger";

export class CategoryCreateResponseDto {
	@ApiProperty({ example: "123" })
	id: number;

	@ApiProperty({ example: "Стрижки" })
	name: string;
}
