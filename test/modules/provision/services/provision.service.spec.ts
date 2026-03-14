/* eslint-disable @typescript-eslint/unbound-method */
import {
	BadRequestException,
	ForbiddenException,
	NotFoundException
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { Roles } from "@/generated";
import { AccountService } from "@/src/modules/account/account.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { AccountRepository } from "@/src/modules/account/repositories/account.repository";
import { CategoryRepository } from "@/src/modules/category/repositories/category.repository";
import { CreateProvisionRequestDto } from "@/src/modules/provision/dto/create-provision-request.dto";
import { SortOrder } from "@/src/modules/provision/dto/sort-provision-request.dto";
import { ProvisionRepository } from "@/src/modules/provision/repositories/provision.repository";
import { ProvisionService } from "@/src/modules/provision/services/provision.service";
import { ProvisionMapper } from "@/src/shared/mappers/provision.mapper";

describe("ProvisionService", () => {
	let service: ProvisionService;
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
				ProvisionService,
				{
					provide: ProvisionRepository,
					useValue: {
						create: jest.fn(),
						findById: jest.fn(),
						findByUser: jest.fn(),
						findAll: jest.fn(),
						findAllSortedByPrice: jest.fn(),
						findByIdAndFreeSlots: jest.fn(),
						deleteById: jest.fn(),
						deleteByUserId: jest.fn()
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
				}
			]
		}).compile();

		service = module.get(ProvisionService);
		provisionRepo = module.get(ProvisionRepository);
		categoryRepo = module.get(CategoryRepository);
		accountRepo = module.get(AccountRepository);
		accountService = module.get(AccountService);

		jest.spyOn(ProvisionMapper, "toResponse").mockImplementation(
			v => v as unknown as any
		);
		jest.spyOn(ProvisionMapper, "toResponseList").mockImplementation(
			v => v as unknown as any
		);
	});

	describe("create", () => {
		beforeEach(() => {
			accountService.findById.mockResolvedValue({
				id: 1n
			} as unknown as any);
		});

		it("ошибка: категория не найдена", async () => {
			categoryRepo.findById.mockResolvedValueOnce(null);
			await expect(
				service.create(
					{ categoryId: 999 } as CreateProvisionRequestDto,
					mockUserTg
				)
			).rejects.toThrow(NotFoundException);
		});

		it("ошибка: время в прошлом", async () => {
			categoryRepo.findById.mockResolvedValueOnce({
				id: 1n
			} as unknown as any);
			const past = new Date(Date.now() - 10000).toISOString();
			await expect(
				service.create(
					{
						categoryId: 1,
						time: [past]
					} as CreateProvisionRequestDto,
					mockUserTg
				)
			).rejects.toThrow(BadRequestException);
		});

		it("ошибка: дубликаты слотов", async () => {
			categoryRepo.findById.mockResolvedValueOnce({
				id: 1n
			} as unknown as any);
			const future = new Date(Date.now() + 10000).toISOString();
			await expect(
				service.create(
					{
						categoryId: 1,
						time: [future, future]
					} as CreateProvisionRequestDto,
					mockUserTg
				)
			).rejects.toThrow(BadRequestException);
		});
	});

	describe("findAll", () => {
		it("ошибка: услуг нет", async () => {
			provisionRepo.findAll.mockResolvedValueOnce([]);
			await expect(service.findAll()).rejects.toThrow(NotFoundException);
		});
	});

	describe("findByIdAndFreeSlots", () => {
		it("ошибка: услуга не найдена", async () => {
			provisionRepo.findByIdAndFreeSlots.mockResolvedValueOnce(null);
			await expect(
				service.findByIdAndFreeSlots(1n, SortOrder.ASC)
			).rejects.toThrow(NotFoundException);
		});

		it("ошибка: нет свободных слотов", async () => {
			provisionRepo.findByIdAndFreeSlots.mockResolvedValueOnce({
				slots: []
			} as unknown as any);
			await expect(
				service.findByIdAndFreeSlots(1n, SortOrder.ASC)
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("deleteById", () => {
		it("ошибка: чужая услуга (не админ)", async () => {
			provisionRepo.findById.mockResolvedValueOnce({
				userId: 999n
			} as unknown as any);
			accountRepo.findById.mockResolvedValueOnce({
				role: Roles.CLIENT
			} as unknown as any);
			await expect(service.deleteById(1n, mockUserTg)).rejects.toThrow(
				ForbiddenException
			);
		});

		it("успех: админ удаляет чужую", async () => {
			provisionRepo.findById.mockResolvedValueOnce({
				userId: 999n
			} as unknown as any);
			accountRepo.findById.mockResolvedValueOnce({
				role: Roles.ADMIN
			} as unknown as any);
			provisionRepo.deleteById.mockResolvedValueOnce({
				id: 1n
			} as unknown as any);
			const res = await service.deleteById(1n, mockUserTg);
			expect(res.success).toBe(true);
		});
	});
});
