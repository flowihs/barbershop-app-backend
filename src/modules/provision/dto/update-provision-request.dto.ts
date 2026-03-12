import { IsNotEmpty } from "class-validator";

export class UpdateProvisionRequestDto {
	@IsNotEmpty()
	id: number;
	title?: string;
	description?: string;
	price?: number;
	image?: string;
}
