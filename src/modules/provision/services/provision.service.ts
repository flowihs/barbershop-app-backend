import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from "@nestjs/common";

import { Roles } from "@/generated";
import { AccountService } from "@/src/modules/account/account.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { AccountRepository } from "@/src/modules/account/repositories/account.repository";
import { CategoryRepository } from "@/src/modules/category/repositories/category.repository";
import { CreateProvisionRequestDto } from "@/src/modules/provision/dto/create-provision-request.dto";
import { CreateProvisionResponseDto } from "@/src/modules/provision/dto/create-provision-response.dto";
import { DeleteResponseDto } from "@/src/modules/provision/dto/delete-response.dto";
import { ProvisionResponseDto } from "@/src/modules/provision/dto/provision-response.dto";
import { SortProvisionPriceRequestDto } from "@/src/modules/provision/dto/sort-provision-price-request.dto";
import { ProvisionRepository } from "@/src/modules/provision/repositories/provision.repository";
import { ProvisionMapper } from "@/src/shared/mappers/provision.mapper";

@Injectable()
export class ProvisionService {
	constructor(
		private readonly provisionRepository: ProvisionRepository,
		private readonly accountService: AccountService,
		private readonly categoryRepository: CategoryRepository,
		private readonly accountRepository: AccountRepository
	) {}

	public async create(
		dto: CreateProvisionRequestDto,
		userTg: TelegramUserDto
	): Promise<CreateProvisionResponseDto> {
		const userId = BigInt(userTg.id);
		const categoryId = BigInt(dto.categoryId);

		await this.accountService.findById(userId);

		const category = await this.categoryRepository.findById(categoryId);
		if (!category)
			throw new NotFoundException(
				`Категория с ID ${categoryId} не найдена`
			);

		if (!dto.time?.length)
			throw new BadRequestException(
				"Массив времени (time) не может быть пустым"
			);

		const now = new Date();
		const uniqueTimes = new Set<string>();

		const slotsData = dto.time.map(timeStr => {
			const slotDate = new Date(timeStr);
			if (isNaN(slotDate.getTime()))
				throw new BadRequestException(
					`Некорректный формат даты: ${timeStr}`
				);
			if (slotDate < now)
				throw new BadRequestException(
					`Время слота не может быть в прошлом: ${timeStr}`
				);
			if (uniqueTimes.has(timeStr))
				throw new BadRequestException(
					`Дублирующееся время слота: ${timeStr}`
				);
			uniqueTimes.add(timeStr);
			return { time: slotDate, isBooking: false };
		});

		const provision = await this.provisionRepository.create(
			{
				title: dto.title,
				description: dto.description,
				price: dto.price,
				image: dto.image
			},
			categoryId,
			userId,
			slotsData
		);

		return ProvisionMapper.toResponse(provision);
	}

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

	public async findAllSortedByPrice(
		query: SortProvisionPriceRequestDto
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
		order: "asc" | "desc" = "asc"
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

	public async deleteById(
		id: bigint,
		userTg: TelegramUserDto
	): Promise<DeleteResponseDto> {
		const provision = await this.provisionRepository.findById(id);
		if (!provision)
			throw new NotFoundException("Услуга для удаления не найдена");

		const requester = await this.accountRepository.findById(
			BigInt(userTg.id)
		);
		if (!requester) throw new NotFoundException("Пользователь не найден");

		if (
			provision.userId !== requester.id &&
			requester.role !== Roles.ADMIN
		) {
			throw new ForbiddenException(
				"Вы можете удалять только свои услуги"
			);
		}

		await this.provisionRepository.deleteById(id);
		return {
			success: true,
			message: "Услуга успешно удалена"
		};
	}

	public async deleteByUser(
		userTg: TelegramUserDto
	): Promise<DeleteResponseDto> {
		const userId = BigInt(userTg.id);
		const provisions = await this.provisionRepository.findByUser(userId);
		if (!provisions.length)
			throw new NotFoundException("У вас нет услуг для удаления");

		await this.provisionRepository.deleteByUserId(userId);
		return {
			success: true,
			message: "Все ваши услуги были удалены"
		};
	}
}
