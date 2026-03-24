import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateSlotRequestDto {
	@IsDateString()
	@IsNotEmpty()
	time: string;

	@IsNumber()
	@IsNotEmpty()
	provisionId: number;
}
