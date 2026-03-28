import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewRequestDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	rating: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsInt()
	userId: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsInt()
	provisionId: number;
}
