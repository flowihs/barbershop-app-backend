/* eslint-disable @typescript-eslint/unbound-method */
import {
	BadRequestException,
	CanActivate,
	NotFoundException
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { Roles } from "@/generated";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { ProvisionController } from "@/src/modules/provision/controllers/provision.controller";
import { CreateProvisionRequestDto } from "@/src/modules/provision/dto/create-provision-request.dto";
import { CreateProvisionResponseDto } from "@/src/modules/provision/dto/create-provision-response.dto";
import { ProvisionDeleteResponseDto } from "@/src/modules/provision/dto/provision-delete-response.dto";
import { ProvisionResponseDto } from "@/src/modules/provision/dto/provision-response.dto";
import { SortProvisionRequestDto } from "@/src/modules/provision/dto/sort-provision-request.dto";
import { ProvisionMutationService } from "@/src/modules/provision/services/provision-mutation.service";
import { ProvisionQueryService } from "@/src/modules/provision/services/provision-query.service";
import { TelegramAuthGuard } from "@/src/shared/guards/auth.guard";
import { RolesGuard } from "@/src/shared/guards/roles.guard";

describe("ProvisionController", () => {
	let controller: ProvisionController;
	let queryService: jest.Mocked<ProvisionQueryService>;
	let mutationService: jest.Mocked<ProvisionMutationService>;

	const mockUser: TelegramUserDto = {
		id: 123,
		first_name: "Test",
		username: "test_user"
	};

	const mockUserProfile = {
		id: 123,
		firstName: "Test",
		username: "test_user",
		description: null,
		email: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		role: Roles.BARBER
	};

	const mockCategory = {
		id: 1n,
		name: "Стрижки",
		createdAt: new Date(),
		updatedAt: new Date()
	};

	const mockSlot = {
		id: 1n,
		time: new Date(),
		isBooking: false
	};

	const mockProvisionResponse: ProvisionResponseDto = {
		id: 1,
		title: "Стрижка",
		description: "Классическая мужская стрижка",
		price: 55,
		image: "uploads/image.jpg",
		category: mockCategory,
		user: mockUserProfile,
		slots: [mockSlot]
	} as unknown as ProvisionResponseDto;

	const mockCreateProvisionResponse: CreateProvisionResponseDto = {
		id: 1,
		title: "Стрижка",
		description: "Классическая мужская стрижка",
		price: 55,
		image: "uploads/image.jpg",
		user: mockUserProfile,
		category: mockCategory,
		slots: [mockSlot]
	} as unknown as CreateProvisionResponseDto;

	const mockDeleteResponse: ProvisionDeleteResponseDto = {
		success: true,
		message: "Услуга успешно удалена"
	};

	const mockGuard: CanActivate = {
		canActivate: jest.fn(() => true)
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProvisionController],
			providers: [
				{
					provide: ProvisionQueryService,
					useValue: {
						findAll: jest.fn(),
						findById: jest.fn(),
						findByUser: jest.fn(),
						findAllSortedByPrice: jest.fn(),
						findByIdAndFreeSlots: jest.fn(),
						findAllByCategoryId: jest.fn()
					}
				},
				{
					provide: ProvisionMutationService,
					useValue: {
						create: jest.fn(),
						deleteById: jest.fn(),
						deleteByUser: jest.fn()
					}
				}
			]
		})
			.overrideGuard(TelegramAuthGuard)
			.useValue(mockGuard)
			.overrideGuard(RolesGuard)
			.useValue(mockGuard)
			.compile();

		controller = module.get(ProvisionController);
		queryService = module.get(ProvisionQueryService);
		mutationService = module.get(ProvisionMutationService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		const mockDto: CreateProvisionRequestDto = {
			title: "Стрижка",
			description: "Классическая мужская стрижка",
			price: 55,
			categoryId: 1,
			time: ["2024-01-20T10:00:00Z", "2024-01-20T11:00:00Z"],
			image: "uploads/image.jpg"
		};

		it("успех: услуга создана", async () => {
			mutationService.create.mockResolvedValueOnce(
				mockCreateProvisionResponse
			);

			const result = await controller.create(mockUser, mockDto);

			expect(result).toEqual(mockCreateProvisionResponse);
			expect(mutationService.create).toHaveBeenCalledWith(
				mockDto,
				mockUser
			);
			expect(mutationService.create).toHaveBeenCalledTimes(1);
		});

		it("ошибка: категория не найдена", async () => {
			mutationService.create.mockRejectedValue(
				new NotFoundException("Категория не найдена")
			);

			await expect(controller.create(mockUser, mockDto)).rejects.toThrow(
				NotFoundException
			);
		});

		it("ошибка: неверные данные", async () => {
			mutationService.create.mockRejectedValue(
				new BadRequestException("Неверные данные")
			);

			await expect(controller.create(mockUser, mockDto)).rejects.toThrow(
				BadRequestException
			);
		});
	});

	describe("findAll", () => {
		it("успех: получение всех услуг", async () => {
			const mockProvisions = [mockProvisionResponse];
			queryService.findAll.mockResolvedValueOnce(
				mockProvisions as unknown as any
			);

			const result = await controller.findAll();

			expect(result).toEqual(mockProvisions);
			expect(queryService.findAll).toHaveBeenCalledTimes(1);
		});

		it("успех: пустой список услуг", async () => {
			queryService.findAll.mockResolvedValueOnce([]);

			const result = await controller.findAll();

			expect(result).toEqual([]);
			expect(queryService.findAll).toHaveBeenCalledTimes(1);
		});

		it("ошибка: база данных недоступна", async () => {
			queryService.findAll.mockRejectedValue(new Error("Database error"));

			await expect(controller.findAll()).rejects.toThrow(
				"Database error"
			);
		});
	});

	describe("findAllSortByPrice", () => {
		const mockQuery: SortProvisionRequestDto = {
			order: "asc"
		} as SortProvisionRequestDto;

		it("успех: получение услуг с сортировкой по возрастанию цены", async () => {
			const mockProvisions = [mockProvisionResponse];
			queryService.findAllSortedByPrice.mockResolvedValueOnce(
				mockProvisions as unknown as any
			);

			const result = await controller.findAllSortByPrice(mockQuery);

			expect(result).toEqual(mockProvisions);
			expect(queryService.findAllSortedByPrice).toHaveBeenCalledWith(
				mockQuery
			);
		});

		it("успех: получение услуг с сортировкой по убыванию цены", async () => {
			const descQuery: SortProvisionRequestDto = {
				order: "desc"
			} as SortProvisionRequestDto;
			const mockProvisions = [mockProvisionResponse];
			queryService.findAllSortedByPrice.mockResolvedValueOnce(
				mockProvisions as unknown as any
			);

			const result = await controller.findAllSortByPrice(descQuery);

			expect(result).toEqual(mockProvisions);
			expect(queryService.findAllSortedByPrice).toHaveBeenCalledWith(
				descQuery
			);
		});
	});

	describe("findMyProvisions", () => {
		it("успех: получение услуг пользователя", async () => {
			const mockProvisions = [mockProvisionResponse];
			queryService.findByUser.mockResolvedValueOnce(
				mockProvisions as unknown as any
			);

			const result = await controller.findMyProvisions(mockUser);

			expect(result).toEqual(mockProvisions);
			expect(queryService.findByUser).toHaveBeenCalledWith(
				BigInt(mockUser.id)
			);
		});

		it("успех: пустой список услуг пользователя", async () => {
			queryService.findByUser.mockResolvedValueOnce([]);

			const result = await controller.findMyProvisions(mockUser);

			expect(result).toEqual([]);
			expect(queryService.findByUser).toHaveBeenCalledWith(
				BigInt(mockUser.id)
			);
		});

		it("ошибка: услуги не найдены", async () => {
			queryService.findByUser.mockRejectedValue(
				new NotFoundException("Услуги не найдены")
			);

			await expect(controller.findMyProvisions(mockUser)).rejects.toThrow(
				NotFoundException
			);
		});
	});

	describe("findByIdAndFreeSlots", () => {
		const provisionId = 1n;

		it("успех: получение услуги со свободными слотами с сортировкой asc", async () => {
			queryService.findByIdAndFreeSlots.mockResolvedValueOnce(
				mockProvisionResponse
			);

			const result = await controller.findByIdAndFreeSlots(
				provisionId,
				"asc"
			);

			expect(result).toEqual(mockProvisionResponse);
			expect(queryService.findByIdAndFreeSlots).toHaveBeenCalledWith(
				provisionId,
				"asc"
			);
		});

		it("успех: получение услуги со свободными слотами с сортировкой desc", async () => {
			queryService.findByIdAndFreeSlots.mockResolvedValueOnce(
				mockProvisionResponse
			);

			const result = await controller.findByIdAndFreeSlots(
				provisionId,
				"desc"
			);

			expect(result).toEqual(mockProvisionResponse);
			expect(queryService.findByIdAndFreeSlots).toHaveBeenCalledWith(
				provisionId,
				"desc"
			);
		});

		it("ошибка: услуга не найдена", async () => {
			queryService.findByIdAndFreeSlots.mockRejectedValue(
				new NotFoundException("Услуга не найдена")
			);

			await expect(
				controller.findByIdAndFreeSlots(provisionId, "asc")
			).rejects.toThrow(NotFoundException);
		});

		it("ошибка: свободные слоты не найдены", async () => {
			queryService.findByIdAndFreeSlots.mockRejectedValue(
				new NotFoundException("Свободные слоты не найдены")
			);

			await expect(
				controller.findByIdAndFreeSlots(provisionId, "asc")
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("deleteMyProvisions", () => {
		it("успех: удаление всех услуг пользователя", async () => {
			mutationService.deleteByUser.mockResolvedValueOnce(
				mockDeleteResponse
			);

			const result = await controller.deleteMyProvisions(mockUser);

			expect(result).toEqual(mockDeleteResponse);
			expect(mutationService.deleteByUser).toHaveBeenCalledWith(mockUser);
		});

		it("ошибка: услуги не найдены", async () => {
			mutationService.deleteByUser.mockRejectedValue(
				new NotFoundException("Услуги не найдены")
			);

			await expect(
				controller.deleteMyProvisions(mockUser)
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("findById", () => {
		const provisionId = 1n;

		it("успех: получение услуги по ID", async () => {
			queryService.findById.mockResolvedValueOnce(mockProvisionResponse);

			const result = await controller.findById(provisionId);

			expect(result).toEqual(mockProvisionResponse);
			expect(queryService.findById).toHaveBeenCalledWith(provisionId);
		});

		it("ошибка: услуга не найдена", async () => {
			queryService.findById.mockRejectedValue(
				new NotFoundException("Услуга не найдена")
			);

			await expect(controller.findById(provisionId)).rejects.toThrow(
				NotFoundException
			);
		});
	});

	describe("findAllByCategoryId", () => {
		const categoryId = 1n;

		it("успех: получение услуг по категории", async () => {
			const mockProvisions = [mockProvisionResponse];
			queryService.findAllByCategoryId.mockResolvedValueOnce(
				mockProvisions as unknown as any
			);

			const result = await controller.findAllByCategoryId(categoryId);

			expect(result).toEqual(mockProvisions);
			expect(queryService.findAllByCategoryId).toHaveBeenCalledWith(
				categoryId
			);
		});

		it("успех: пустой список услуг по категории", async () => {
			queryService.findAllByCategoryId.mockResolvedValueOnce([]);

			const result = await controller.findAllByCategoryId(categoryId);

			expect(result).toEqual([]);
			expect(queryService.findAllByCategoryId).toHaveBeenCalledWith(
				categoryId
			);
		});

		it("ошибка: услуги с такой категорией не найдены", async () => {
			queryService.findAllByCategoryId.mockRejectedValue(
				new NotFoundException("Услуги с такой категорией не найдены")
			);

			await expect(
				controller.findAllByCategoryId(categoryId)
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("delete", () => {
		const provisionId = 1n;

		it("успех: удаление услуги", async () => {
			mutationService.deleteById.mockResolvedValueOnce(
				mockDeleteResponse
			);

			const result = await controller.delete(provisionId, mockUser);

			expect(result).toEqual(mockDeleteResponse);
			expect(mutationService.deleteById).toHaveBeenCalledWith(
				provisionId,
				mockUser
			);
		});

		it("ошибка: услуга не найдена", async () => {
			mutationService.deleteById.mockRejectedValue(
				new NotFoundException("Услуга не найдена")
			);

			await expect(
				controller.delete(provisionId, mockUser)
			).rejects.toThrow(NotFoundException);
		});

		it("ошибка: доступ запрещен", async () => {
			mutationService.deleteById.mockRejectedValue(
				new BadRequestException("Доступ запрещен")
			);

			await expect(
				controller.delete(provisionId, mockUser)
			).rejects.toThrow(BadRequestException);
		});
	});
});
