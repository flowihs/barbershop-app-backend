import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateProfileRequestDto {
	@IsString()
	@IsOptional()
	@ApiProperty({ example: "Начинающий барбер 10 лет", required: false })
	description?: string;

	@IsString()
	@IsEmail()
	@IsOptional()
	@ApiProperty({ example: "barber@gmail.com", required: false })
	email?: string;
}
