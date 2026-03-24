/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { CategoryService } from "@/src/modules/category/services/category.service";
import { SortOrder } from "@/src/modules/provision/dto/sort-provision-request.dto";
import { ProvisionRepository } from "@/src/modules/provision/repositories/provision.repository";
import { ProvisionQueryService } from "@/src/modules/provision/services/provision-query.service";
import { ProvisionMapper } from "@/src/shared/mappers/provision.mapper";

describe("ProvisionQueryService", () => {
	let service: ProvisionQueryService;
	let provisionRepo: jest.Mocked<ProvisionRepository>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProvisionQueryService,
				{
					provide: ProvisionRepository,
					useValue: {
						findAll: jest.fn(),
						findById: jest.fn(),
						findByUser: jest.fn(),
						findAllSortedByUpdatedAt: jest.fn(),
						findAllSortedByPrice: jest.fn(),
						findByIdAndFreeSlots: jest.fn()
					}
				},
				{
					provide: CategoryService,
					useValue: {}
				}
			]
		}).compile();

		service = module.get(ProvisionQueryService);
		provisionRepo = module.get(ProvisionRepository);
		void module.get(CategoryService);

		jest.spyOn(ProvisionMapper, "toResponse").mockImplementation(
			v => v as unknown as any
		);
		jest.spyOn(ProvisionMapper, "toResponseList").mockImplementation(
			v => v as unknown as any
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("findAll", () => {
		it("успех: получены все услуги", async () => {
			const mockProvisions = [
				{ id: 1n, title: "Service 1" },
				{ id: 2n, title: "Service 2" }
			];
			provisionRepo.findAll.mockResolvedValueOnce(
				mockProvisions as unknown as any
			);

			const result = await service.findAll();

			expect(result).toEqual(mockProvisions);
			expect(provisionRepo.findAll).toHaveBeenCalled();
			expect(ProvisionMapper.toResponseList).toHaveBeenCalledWith(
				mockProvisions
			);
		});

		it("ошибка: услуги не найдены", async () => {
			provisionRepo.findAll.mockResolvedValue([]);

			await expect(service.findAll()).rejects.toThrow(NotFoundException);
			await expect(service.findAll()).rejects.toThrow(
				"Услуги не найдены"
			);
		});
	});

	describe("findById", () => {
		const provisionId = 1n;
		const mockProvision = { id: provisionId, title: "Service 1" };

		it("успех: услуга найдена", async () => {
			provisionRepo.findById.mockResolvedValueOnce(
				mockProvision as unknown as any
			);

			const result = await service.findById(provisionId);

			expect(result).toEqual(mockProvision);
			expect(provisionRepo.findById).toHaveBeenCalledWith(provisionId);
			expect(ProvisionMapper.toResponse).toHaveBeenCalledWith(
				mockProvision
			);
		});

		it("ошибка: услуга не найдена", async () => {
			provisionRepo.findById.mockResolvedValue(null);

			await expect(service.findById(provisionId)).rejects.toThrow(
				NotFoundException
			);
		});
	});

	describe("findByUser", () => {
		const userId = 100n;
		const mockProvisions = [
			{ id: 1n, title: "Service 1", userId },
			{ id: 2n, title: "Service 2", userId }
		];

		it("успех: услуги пользователя найдены", async () => {
			provisionRepo.findByUser.mockResolvedValueOnce(
				mockProvisions as unknown as any
			);

			const result = await service.findByUser(userId);

			expect(result).toEqual(mockProvisions);
			expect(provisionRepo.findByUser).toHaveBeenCalledWith(userId);
		});

		it("ошибка: пользователь не создал услуг", async () => {
			provisionRepo.findByUser.mockResolvedValue([]);

			await expect(service.findByUser(userId)).rejects.toThrow(
				NotFoundException
			);
		});
	});

	describe("findAllSortedByPrice", () => {
		const mockProvisions = [
			{ id: 1n, price: 5000 },
			{ id: 2n, price: 10000 }
		];

		it("успех: услуги отсортированы по цене", async () => {
			provisionRepo.findAllSortedByPrice.mockResolvedValueOnce(
				mockProvisions as unknown as any
			);

			const result = await service.findAllSortedByPrice({
				order: SortOrder.ASC
			});

			expect(result).toEqual(mockProvisions);
			expect(provisionRepo.findAllSortedByPrice).toHaveBeenCalledWith(
				SortOrder.ASC
			);
		});

		it("ошибка: список услуг пуст", async () => {
			provisionRepo.findAllSortedByPrice.mockResolvedValue([]);

			await expect(
				service.findAllSortedByPrice({ order: SortOrder.ASC })
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("findByIdAndFreeSlots", () => {
		const provisionId = 1n;
		const mockProvision = {
			id: provisionId,
			slots: [{ id: 1n, time: new Date(), isBooking: false }]
		};

		it("успех: услуга с свободными слотами найдена", async () => {
			provisionRepo.findByIdAndFreeSlots.mockResolvedValueOnce(
				mockProvision as unknown as any
			);

			const result = await service.findByIdAndFreeSlots(
				provisionId,
				SortOrder.ASC
			);

			expect(result).toEqual(mockProvision);
			expect(provisionRepo.findByIdAndFreeSlots).toHaveBeenCalledWith(
				provisionId,
				SortOrder.ASC
			);
		});

		it("ошибка: услуга не найдена", async () => {
			provisionRepo.findByIdAndFreeSlots.mockResolvedValue(null);

			await expect(
				service.findByIdAndFreeSlots(provisionId, SortOrder.ASC)
			).rejects.toThrow(NotFoundException);
		});

		it("ошибка: нет свободных слотов", async () => {
			const provisionWithoutSlots = {
				id: provisionId,
				slots: []
			};
			provisionRepo.findByIdAndFreeSlots.mockResolvedValue(
				provisionWithoutSlots as unknown as any
			);

			await expect(
				service.findByIdAndFreeSlots(provisionId, SortOrder.ASC)
			).rejects.toThrow(NotFoundException);
		});
	});
});
