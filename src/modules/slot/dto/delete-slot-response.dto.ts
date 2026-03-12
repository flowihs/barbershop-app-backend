import { ApiProperty } from "@nestjs/swagger";

export class DeleteSlotResponseDto {
	@ApiProperty({ example: "Слот был удален успешно" })
	message: string;

	@ApiProperty({ example: true })
	success: boolean;
}
