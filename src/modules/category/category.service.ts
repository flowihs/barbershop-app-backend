import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";

import { CategoryCreateRequestDto } from "@/src/modules/category/dto/category-create-request.dto";
import { CategoryRepository } from "@/src/modules/category/repositories/category.repository";

@Injectable()
export class CategoryService {
	public constructor(
		private readonly categoryRepository: CategoryRepository
	) {}

	public async create(dto: CategoryCreateRequestDto) {
		const { name } = dto;

		const category = await this.categoryRepository.findByName(name);

		if (category) {
			throw new BadRequestException(
				"Категория с таким названием уже существует"
			);
		}

		return await this.categoryRepository.create(name);
	}

	public async deleteByName(name: string) {
		await this.findByName(name);

		await this.categoryRepository.deleteByName(name);

		return true;
	}

	public async deleteById(id: bigint) {
		await this.findById(id);

		await this.categoryRepository.deleteById(id);

		return true;
	}

	public async findById(id: bigint) {
		const category = await this.categoryRepository.findById(id);

		if (!category) {
			throw new NotFoundException("Категория с таким id не была найдена");
		}

		return category;
	}

	public async findByName(name: string) {
		const category = await this.categoryRepository.findByName(name);

		if (!category) {
			throw new NotFoundException(
				"Ошибка с таким названием не была найдена"
			);
		}

		return category;
	}
}
