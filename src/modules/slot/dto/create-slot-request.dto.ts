import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateSlotRequestDto {
	@IsDateString()
	@IsNotEmpty()
	time: string;

	@IsBoolean()
	@IsNotEmpty()
	isBooking: boolean;

	@IsNumber()
	@IsNotEmpty()
	provisionId: number;
}
