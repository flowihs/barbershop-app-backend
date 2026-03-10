import { Injectable, NotFoundException } from "@nestjs/common";

import { AccountService } from "@/src/modules/account/account.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { CreateProvisionRequestDto } from "@/src/modules/provision/dto/create-provision-request.dto";
import { CreateProvisionResponseDto } from "@/src/modules/provision/dto/create-provision-response.dto";
import { DeleteResponseDto } from "@/src/modules/provision/dto/delete-response.dto";
import { ProvisionResponseDto } from "@/src/modules/provision/dto/provision-response.dto";
import { SortProvisionPriceRequestDto } from "@/src/modules/provision/dto/sort-provision-price-request.dto";
import { ProvisionRepository } from "@/src/modules/provision/repositories/provision.repository";
import { ProvisionMapper } from "@/src/shared/mappers/provision.mapper";

type slotData = {
	time: Date;
	isBooking: boolean;
};

@Injectable()
export class ProvisionService {
	constructor(
		private readonly provisionRepository: ProvisionRepository,
		private readonly accountService: AccountService
	) {}

	public async create(
		dto: CreateProvisionRequestDto,
		userTg: TelegramUserDto
	): Promise<CreateProvisionResponseDto> {
		await this.accountService.findById(userTg.id);

		const slotsData: slotData[] = dto.time.map(timeStr => ({
			time: new Date(timeStr),
			isBooking: false
		}));

		const provisionData = {
			title: dto.title,
			description: dto.description,
			price: dto.price,
			image: dto.image
		};

		const provision = await this.provisionRepository.create(
			provisionData,
			BigInt(dto.categoryId),
			BigInt(userTg.id),
			slotsData
		);

		return ProvisionMapper.toResponse(provision);
	}

	public async deleteById(id: bigint): Promise<DeleteResponseDto> {
		await this.provisionRepository.deleteById(id);
		return {
			success: true,
			message: "Удаление  услуги по id было выполнено успешно"
		};
	}

	public async deleteByUser(
		userTg: TelegramUserDto
	): Promise<DeleteResponseDto> {
		await this.findByUser(BigInt(userTg.id));
		await this.provisionRepository.deleteByUserId(BigInt(userTg.id));
		return {
			success: true,
			message: "Удаление услуг пользователя было выполнено успешно"
		};
	}

	public async findAll(): Promise<ProvisionResponseDto[]> {
		const provisions = await this.provisionRepository.findAll();

		if (!provisions) {
			throw new NotFoundException("Список услуг пуст");
		}

		return ProvisionMapper.toResponseList(provisions);
	}

	public async findById(id: bigint): Promise<ProvisionResponseDto> {
		const provision = await this.provisionRepository.findById(id);

		if (!provision) {
			throw new NotFoundException("Услуга не была найдена");
		}

		return ProvisionMapper.toResponse(provision);
	}

	public async findByUser(userId: bigint): Promise<ProvisionResponseDto[]> {
		const provisions = await this.provisionRepository.findByUser(userId);

		if (!provisions) {
			throw new NotFoundException(
				"Записи данного пользователя не были найдены"
			);
		}

		return ProvisionMapper.toResponseList(provisions);
	}

	public async findAllSortedByPrice(
		query: SortProvisionPriceRequestDto
	): Promise<ProvisionResponseDto[]> {
		const provisions = await this.provisionRepository.findAllSortedByPrice(
			query.order
		);

		if (!provisions) {
			throw new NotFoundException("Список услуг пуст");
		}

		return ProvisionMapper.toResponseList(provisions);
	}

	public async findByIdAndFreeSlots(
		provisionId: bigint,
		order?: "asc" | "desc"
	): Promise<ProvisionResponseDto[]> {
		const provisions = await this.provisionRepository.findByIdAndFreeSlots(
			provisionId,
			order ? order : "asc"
		);

		if (!provisions) {
			throw new NotFoundException(
				"Услуги со свободными слотами не были найдены"
			);
		}

		return ProvisionMapper.toResponseList(provisions);
	}
}
