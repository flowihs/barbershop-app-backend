import { ApiProperty } from "@nestjs/swagger";

export class SlotResponseDto {
	@ApiProperty({ example: "123" })
	id: number;

	@ApiProperty({ example: "18:40" })
	time: Date;

	@ApiProperty({ example: false })
	isBooking: boolean;
}
