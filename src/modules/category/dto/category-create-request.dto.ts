import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CategoryCreateRequestDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ example: "Стрижки" })
	name: string;
}
