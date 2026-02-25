import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
	@ApiProperty({ example: "Начинающий барбер 10 лет", required: false })
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({ example: "barber@gmail.com", required: false })
	@IsString()
	@IsEmail()
	@IsOptional()
	email?: string;
}
