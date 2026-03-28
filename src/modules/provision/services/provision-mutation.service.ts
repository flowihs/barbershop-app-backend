import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { Roles } from "@prisma/client";

import { TelegramUserDto } from "../../account/dto/telegram-user.dto";
import { AccountRepository } from "../../account/repositories/account.repository";
import { CreateProvisionRequestDto } from "../dto/create-provision-request.dto";
import { CreateProvisionResponseDto } from "../dto/create-provision-response.dto";
import { ProvisionDeleteResponseDto } from "../dto/provision-delete-response.dto";
import { UpdateProvisionRequestDto } from "../dto/update-provision-request.dto";
import { ProvisionRepository } from "../repositories/provision.repository";
import { ProvisionQueryService } from "./provision-query.service";
import { ProvisionMapper } from "../../../shared/mappers/provision.mapper";

@Injectable()
export class ProvisionMutationService {
	constructor(
		private readonly provisionRepository: ProvisionRepository,
		private readonly accountRepository: AccountRepository,
		private readonly provisionQueryService: ProvisionQueryService
	) {}

	public async create(
		dto: CreateProvisionRequestDto,
		userTg: TelegramUserDto
	): Promise<CreateProvisionResponseDto> {
		const userId = BigInt(userTg.id);
		const categoryId = BigInt(dto.categoryId);

		if (!dto.time?.length)
			throw new BadRequestException(
				"Массив времени (time) не может быть пустым"
			);

		let slotsData: Array<{ time: Date; isBooking: boolean }>;

		try {
			slotsData = ProvisionMapper.toSlotsCreateData(dto.time);
		} catch (error) {
			if (error instanceof Error) {
				throw new BadRequestException(error.message);
			}
			throw new BadRequestException("Ошибка валидации времени слотов");
		}

		try {
			const provision =
				await this.provisionRepository.createWithTransaction(
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
		} catch (error) {
			if (error instanceof Error) {
				if (
					error.message.includes("Category with ID") &&
					error.message.includes("not found")
				) {
					throw new NotFoundException(
						`Категория с ID ${categoryId} не найдена`
					);
				}
				if (
					error.message.includes("User with ID") &&
					error.message.includes("not found")
				) {
					throw new NotFoundException(
						`Пользователь с ID ${userId} не найден`
					);
				}
			}
			throw new BadRequestException(
				"Ошибка при создании услуги. Транзакция откачена."
			);
		}
	}

	public async update(dto: UpdateProvisionRequestDto) {
		const provisionId: bigint = BigInt(dto.id);

		await this.provisionQueryService.findById(provisionId);

		const updateData = ProvisionMapper.toUpdateData(dto);

		if (
			!updateData.image &&
			!updateData.title &&
			!updateData.description &&
			!updateData.price
		) {
			throw new BadRequestException("Все поля для обновления пустые");
		}

		const updatedProvision =
			await this.provisionRepository.update(updateData);

		return ProvisionMapper.toResponse(updatedProvision);
	}

	public async deleteById(
		id: bigint,
		userTg: TelegramUserDto
	): Promise<ProvisionDeleteResponseDto> {
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

		try {
			await this.provisionRepository.deleteByIdWithTransaction(id);
		} catch (error) {
			if (error instanceof Error) {
				if (
					error.message.includes("Cannot delete provision") &&
					error.message.includes("active bookings")
				) {
					throw new BadRequestException(
						"Нельзя удалить услугу с активными бронированиями"
					);
				}
			}
			throw new BadRequestException(
				"Ошибка при удалении услуги. Транзакция откачена."
			);
		}

		return {
			success: true,
			message: "Услуга успешно удалена"
		};
	}

	public async deleteByUser(
		userTg: TelegramUserDto
	): Promise<ProvisionDeleteResponseDto> {
		const userId = BigInt(userTg.id);

		const provisions = await this.provisionRepository.findByUser(userId);

		if (!provisions.length)
			throw new NotFoundException("У вас нет услуг для удаления");

		try {
			await this.provisionRepository.deleteByUserIdWithTransaction(
				userId
			);
		} catch (error) {
			if (error instanceof Error) {
				if (
					error.message.includes("Cannot delete provisions") &&
					error.message.includes("active bookings")
				) {
					throw new BadRequestException(
						"Нельзя удалить услуги с активными бронированиями"
					);
				}
				if (
					error.message.includes("User has no provisions to delete")
				) {
					throw new NotFoundException(
						"У пользователя нет услуг для удаления"
					);
				}
			}
			throw new BadRequestException(
				"Ошибка при удалении услуг. Транзакция откачена."
			);
		}

		return {
			success: true,
			message: "Все ваши услуги были удалены"
		};
	}
}
