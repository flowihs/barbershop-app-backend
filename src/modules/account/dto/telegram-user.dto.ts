import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class TelegramUserDto {
	@IsNumber()
	@ApiProperty({ example: 123456 })
	id: number;

	@IsString()
	@ApiProperty({ example: "Alex" })
	first_name: string;

	@IsOptional()
	@IsString()
	@ApiProperty({ example: "alexdev", required: false })
	username?: string;
}
