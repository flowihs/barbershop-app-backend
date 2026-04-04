import { ApiProperty } from "@nestjs/swagger";
import { Roles } from "@prisma/client";

export class TelegramProfileDto {
	@ApiProperty({ example: 123456789, description: "Telegram ID" })
	id: number;

	@ApiProperty({ example: "John", description: "Имя пользователя" })
	firstName: string;

	@ApiProperty({ example: "john_doe", nullable: true })
	username: string | null;

	@ApiProperty({ example: "Описание профиля", nullable: true })
	description: string | null;

	@ApiProperty({ example: "user@example.com", nullable: true })
	email: string | null;

	@ApiProperty({ example: "Роль пользователя", nullable: false })
	role: Roles;

	@ApiProperty({ example: "2024-01-01T00:00:00Z" })
	createdAt?: Date;

	@ApiProperty({ example: "2024-01-01T00:00:00Z" })
	updatedAt?: Date;
}
