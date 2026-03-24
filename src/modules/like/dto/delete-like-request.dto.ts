import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteLikeRequestDto {
	@ApiProperty({
		example: "12345678",
		description: "ID записи о лайке для удаления"
	})
	@IsInt()
	@IsNotEmpty()
	id: number;
}
