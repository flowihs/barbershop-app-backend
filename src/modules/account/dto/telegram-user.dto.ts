import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class TelegramUserDto {
	@ApiProperty({ example: 123456 })
	@IsNumber()
	id: number;

	@ApiProperty({ example: "Alex" })
	@IsString()
	first_name: string;

	@ApiProperty({ example: "alexdev", required: false })
	@IsOptional()
	@IsString()
	username?: string;
}
