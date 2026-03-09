import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ProvisionIdParamDto {
	@ApiProperty({
		example: "123",
		description: "ID услуги"
	})
	@IsNotEmpty()
	@IsString()
	id: string;
}
