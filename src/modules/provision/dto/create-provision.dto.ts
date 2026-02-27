import {
	IsArray,
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsString,
	Min
} from "class-validator";

export class CreateProvisionDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	price: number;

	@IsNotEmpty()
	@IsArray()
	@IsDateString({}, { each: true })
	time: string[];

	@IsNotEmpty()
	@IsString()
	image: string;
}
