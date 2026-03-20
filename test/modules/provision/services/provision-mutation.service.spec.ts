/* eslint-disable @typescript-eslint/unbound-method */
import {
	BadRequestException,
	ForbiddenException,
	NotFoundException
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Roles } from "@prisma/client";

import { AccountService } from "@/src/modules/account/services/account.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { AccountRepository } from "@/src/modules/account/repositories/account.repository";
import { CategoryRepository } from "@/src/modules/category/repositories/category.repository";
import { CreateProvisionRequestDto } from "@/src/modules/provision/dto/create-provision-request.dto";
import { ProvisionRepository } from "@/src/modules/provision/repositories/provision.repository";
import { ProvisionMutationService } from "@/src/modules/provision/services/provision-mutation.service";
import { ProvisionQueryService } from "@/src/modules/provision/services/provision-query.service";
import { ProvisionMapper } from "@/src/shared/mappers/provision.mapper";

describe("ProvisionMutationService", () => {
	let service: ProvisionMutationService;
	let provisionRepo: jest.Mocked<ProvisionRepository>;
	let categoryRepo: jest.Mocked<CategoryRepository>;
	let accountRepo: jest.Mocked<AccountRepository>;
	let accountService: jest.Mocked<AccountService>;

	const mockUserTg = {
		id: 1,
		role: Roles.BARBER
	} as unknown as TelegramUserDto;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProvisionMutationService,
				{
					provide: ProvisionRepository,
					useValue: {
						create: jest.fn(),
						createWithTransaction: jest.fn(),
						findById: jest.fn(),
						findByUser: jest.fn(),
						update: jest.fn(),
						deleteById: jest.fn(),
						deleteByIdWithTransaction: jest.fn(),
						deleteByUserId: jest.fn(),
						deleteByUserIdWithTransaction: jest.fn()
					}
				},
				{
					provide: AccountRepository,
					useValue: { findById: jest.fn() }
				},
				{
					provide: CategoryRepository,
					useValue: { findById: jest.fn() }
				},
				{
					provide: AccountService,
					useValue: { findById: jest.fn() }
				},
				{
					provide: ProvisionQueryService,
					useValue: { findById: jest.fn() }
				}
			]
		}).compile();

		service = module.get(ProvisionMutationService);
		provisionRepo = module.get(ProvisionRepository);
		categoryRepo = module.get(CategoryRepository);
		accountRepo = module.get(AccountRepository);
		accountService = module.get(AccountService);
		void module.get(ProvisionQueryService);

		jest.spyOn(ProvisionMapper, "toResponse").mockImplementation(
			v => v as unknown as any
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		beforeEach(() => {
			accountService.findById.mockResolvedValue({
				id: 1n
			} as unknown as any);
		});

		it("успех: услуга создана", async () => {
			const dto: CreateProvisionRequestDto = {
				categoryId: 1,
				title: "Haircut",
				description: "Professional haircut",
				price: 5000,
				image: "image.jpg",
				time: [new Date(Date.now() + 86400000).toISOString()]
			};

			categoryRepo.findById.mockResolvedValueOnce({
				id: 1n
			} as unknown as any);

			const mockProvision = { id: 1n, title: "Haircut" };
			provisionRepo.createWithTransaction.mockResolvedValueOnce(
				mockProvision as unknown as any
			);

			const result = await service.create(dto, mockUserTg);

			expect(result).toEqual(mockProvision);
			expect(provisionRepo.createWithTransaction).toHaveBeenCalled();
		});

		it("ошибка: категория не найдена", async () => {
			const dto: CreateProvisionRequestDto = {
				categoryId: 999,
				title: "Haircut",
				description: "Professional haircut",
				price: 5000,
				image: "image.jpg",
				time: [new Date(Date.now() + 86400000).toISOString()]
			};

			categoryRepo.findById.mockResolvedValueOnce(null);
			provisionRepo.createWithTransaction.mockRejectedValueOnce(
				new Error("Category with ID 999 not found")
			);

			await expect(service.create(dto, mockUserTg)).rejects.toThrow(
				NotFoundException
			);
		});

		it("ошибка: время в прошлом", async () => {
			const dto: CreateProvisionRequestDto = {
				categoryId: 1,
				title: "Haircut",
				description: "Professional haircut",
				price: 5000,
				image: "image.jpg",
				time: [new Date(Date.now() - 10000).toISOString()]
			};

			categoryRepo.findById.mockResolvedValueOnce({
				id: 1n
			} as unknown as any);

			await expect(service.create(dto, mockUserTg)).rejects.toThrow(
				BadRequestException
			);
		});

		it("ошибка: дубликаты времени слотов", async () => {
			const futureTime = new Date(Date.now() + 86400000).toISOString();
			const dto: CreateProvisionRequestDto = {
				categoryId: 1,
				title: "Haircut",
				description: "Professional haircut",
				price: 5000,
				image: "image.jpg",
				time: [futureTime, futureTime]
			};

			categoryRepo.findById.mockResolvedValueOnce({
				id: 1n
			} as unknown as any);

			await expect(service.create(dto, mockUserTg)).rejects.toThrow(
				BadRequestException
			);
		});
	});

	describe("deleteById", () => {
		const provisionId = 1n;

		it("успех: своя услуга удалена", async () => {
			const mockProvision = { id: provisionId, userId: 1n };
			const userBarber = { id: 1n, role: Roles.BARBER };

			provisionRepo.findById.mockResolvedValueOnce(
				mockProvision as unknown as any
			);
			accountRepo.findById.mockResolvedValueOnce(
				userBarber as unknown as any
			);
			provisionRepo.deleteByIdWithTransaction.mockResolvedValueOnce(
				undefined as unknown as any
			);

			const result = await service.deleteById(provisionId, mockUserTg);

			expect(result.success).toBe(true);
			expect(
				provisionRepo.deleteByIdWithTransaction
			).toHaveBeenCalledWith(provisionId);
		});

		it("успех: админ удаляет чужую услугу", async () => {
			const mockProvision = { id: provisionId, userId: 999n };
			const adminUser = { id: 1n, role: Roles.ADMIN };

			provisionRepo.findById.mockResolvedValueOnce(
				mockProvision as unknown as any
			);
			accountRepo.findById.mockResolvedValueOnce(
				adminUser as unknown as any
			);
			provisionRepo.deleteByIdWithTransaction.mockResolvedValueOnce(
				undefined as unknown as any
			);

			const result = await service.deleteById(provisionId, mockUserTg);

			expect(result.success).toBe(true);
			expect(
				provisionRepo.deleteByIdWithTransaction
			).toHaveBeenCalledWith(provisionId);
		});

		it("ошибка: чужая услуга (не админ)", async () => {
			const mockProvision = { id: provisionId, userId: 999n };
			const clientUser = { id: 1n, role: Roles.CLIENT };

			provisionRepo.findById.mockResolvedValueOnce(
				mockProvision as unknown as any
			);
			accountRepo.findById.mockResolvedValueOnce(
				clientUser as unknown as any
			);

			await expect(
				service.deleteById(provisionId, mockUserTg)
			).rejects.toThrow(ForbiddenException);
		});

		it("ошибка: услуга не найдена", async () => {
			provisionRepo.findById.mockResolvedValue(null);

			await expect(
				service.deleteById(provisionId, mockUserTg)
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("deleteByUser", () => {
		it("успех: все услуги пользователя удалены", async () => {
			const mockProvisions = [
				{ id: 1n, userId: 1n },
				{ id: 2n, userId: 1n }
			];

			provisionRepo.findByUser.mockResolvedValueOnce(
				mockProvisions as unknown as any
			);
			provisionRepo.deleteByUserIdWithTransaction.mockResolvedValueOnce(
				undefined as unknown as any
			);

			const result = await service.deleteByUser(mockUserTg);

			expect(result.success).toBe(true);
			expect(
				provisionRepo.deleteByUserIdWithTransaction
			).toHaveBeenCalledWith(1n);
		});

		it("ошибка: нет услуг для удаления", async () => {
			provisionRepo.findByUser.mockResolvedValue([]);

			await expect(service.deleteByUser(mockUserTg)).rejects.toThrow(
				NotFoundException
			);
		});
	});
});
