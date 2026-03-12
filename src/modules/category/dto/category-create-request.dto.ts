import { IsNotEmpty, IsString } from "class-validator";

export class CategoryCreateRequestDto {
	@IsNotEmpty()
	@IsString()
	name: string;
}
