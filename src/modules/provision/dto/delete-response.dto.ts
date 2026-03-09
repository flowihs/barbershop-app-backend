import { ApiProperty } from "@nestjs/swagger";

export class DeleteResponseDto {
	@ApiProperty({
		example: true,
		description: "Результат операции удаления"
	})
	success: boolean;

	@ApiProperty({
		example: "Услуга успешно удалена",
		description: "Сообщение о результате операции"
	})
	message: string;
}
