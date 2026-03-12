import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
	transform(value: string): bigint {
		try {
			return BigInt(value);
		} catch {
			throw new BadRequestException("Параметр id должен быть числом.");
		}
	}
}
