import { Injectable, NotFoundException } from "@nestjs/common";

import { CategoryService } from "@/src/modules/category/services/category.service";
import { ProvisionResponseDto } from "@/src/modules/provision/dto/provision-response.dto";
import { SortProvisionRequestDto } from "@/src/modules/provision/dto/sort-provision-request.dto";
import { ProvisionRepository } from "@/src/modules/provision/repositories/provision.repository";
import { ProvisionMapper } from "@/src/shared/mappers/provision.mapper";

@Injectable()
export class ProvisionQueryService {
	constructor(
		private readonly provisionRepository: ProvisionRepository,
		private readonly categoryService: CategoryService
	) {}

	public async findAll(): Promise<ProvisionResponseDto[]> {
		const provisions = await this.provisionRepository.findAll();

		if (!provisions.length)
			throw new NotFoundException("Услуги не найдены");

		return ProvisionMapper.toResponseList(provisions);
	}

	public async findById(id: bigint): Promise<ProvisionResponseDto> {
		const provision = await this.provisionRepository.findById(id);

		if (!provision)
			throw new NotFoundException(`Услуга с ID ${id} не найдена`);

		return ProvisionMapper.toResponse(provision);
	}

	public async findByUser(userId: bigint): Promise<ProvisionResponseDto[]> {
		const provisions = await this.provisionRepository.findByUser(userId);

		if (!provisions.length)
			throw new NotFoundException(
				"У пользователя еще нет созданных услуг"
			);

		return ProvisionMapper.toResponseList(provisions);
	}

	public async findAllSortedByUpdatedAt(
		query: SortProvisionRequestDto
	): Promise<ProvisionResponseDto[]> {
		const provisions =
			await this.provisionRepository.findAllSortedByUpdatedAt(
				query.order
			);

		if (provisions.length) {
			throw new NotFoundException("список услуг пуст");
		}

		return ProvisionMapper.toResponseList(provisions);
	}

	public async findAllSortedByPrice(
		query: SortProvisionRequestDto
	): Promise<ProvisionResponseDto[]> {
		const provisions = await this.provisionRepository.findAllSortedByPrice(
			query.order
		);

		if (!provisions.length)
			throw new NotFoundException("Список услуг пуст");

		return ProvisionMapper.toResponseList(provisions);
	}

	public async findByIdAndFreeSlots(
		provisionId: bigint,
		order: "asc" | "desc"
	): Promise<ProvisionResponseDto> {
		const provision = await this.provisionRepository.findByIdAndFreeSlots(
			provisionId,
			order
		);

		if (!provision) {
			throw new NotFoundException("Услуга не найдена");
		}
		if (!provision.slots || provision.slots.length === 0) {
			throw new NotFoundException("На эту услугу нет свободных слотов");
		}

		return ProvisionMapper.toResponse(provision);
	}

	public async findAllByCategoryId(categoryId: bigint) {
		await this.categoryService.findById(categoryId);

		const provisions =
			await this.provisionRepository.findByCategoryId(categoryId);

		if (provisions.length === 0) {
			throw new NotFoundException(
				"Услуги с данной категорией не были найдены"
			);
		}

		return provisions;
	}
}
