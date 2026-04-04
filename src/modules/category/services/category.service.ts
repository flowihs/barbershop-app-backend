import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";

import { CategoryMapper } from "../../../shared/mappers";
import { CategoryCreateRequestDto } from "../dto/category-create-request.dto";
import { CategoryCreateResponseDto } from "../dto/category-create-response.dto";
import { CategoryResponseDto } from "../dto/category-response.dto";
import { CategoryRepository } from "../repositories/category.repository";

@Injectable()
export class CategoryService {
	public constructor(
		private readonly categoryRepository: CategoryRepository
	) {}

	public async create(
		dto: CategoryCreateRequestDto
	): Promise<CategoryCreateResponseDto> {
		const { name } = dto;

		const category = await this.categoryRepository.findByName(name);

		if (category) {
			throw new BadRequestException(
				"Категория с таким названием уже существует"
			);
		}

		return CategoryMapper.toCreateResponseDto(
			await this.categoryRepository.create(name)
		);
	}

	public async findAll(): Promise<CategoryResponseDto[]> {
		const provisions = await this.categoryRepository.findAll();

		if (provisions.length === 0) {
			throw new NotFoundException("Список категорий пуст");
		}

		return CategoryMapper.toReponseList(provisions);
	}

	public async deleteByName(name: string): Promise<boolean> {
		await this.findByName(name);

		await this.categoryRepository.deleteByName(name);

		return true;
	}

	public async deleteById(id: bigint): Promise<boolean> {
		await this.findById(id);

		await this.categoryRepository.deleteById(id);

		return true;
	}

	public async findById(id: bigint): Promise<CategoryResponseDto> {
		const category = await this.categoryRepository.findById(id);

		if (!category) {
			throw new NotFoundException("Категория с таким id не была найдена");
		}

		return CategoryMapper.toResponse(category);
	}

	public async findByName(name: string): Promise<CategoryResponseDto> {
		const category = await this.categoryRepository.findByName(name);

		if (!category) {
			throw new NotFoundException(
				"Ошибка с таким названием не была найдена"
			);
		}

		return CategoryMapper.toResponse(category);
	}
}
