/* eslint-disable @typescript-eslint/unbound-method */
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

import { Roles } from "@/generated";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";
import { ProvisionController } from "@/src/modules/provision/controllers/provision.controller";
import { CreateProvisionRequestDto } from "@/src/modules/provision/dto/create-provision-request.dto";
import { CreateProvisionResponseDto } from "@/src/modules/provision/dto/create-provision-response.dto";
import { DeleteResponseDto } from "@/src/modules/provision/dto/provision-delete-response.dto";
import { ProvisionResponseDto } from "@/src/modules/provision/dto/provision-response.dto";
import {
	SortOrder,
	SortProvisionPriceRequestDto
} from "@/src/modules/provision/dto/sort-provision-price-request.dto";
import { ProvisionService } from "@/src/modules/provision/services/provision.service";
import { TelegramAuthGuard } from "@/src/shared/guards/auth.guard";

describe("ProvisionController", () => {
	let controller: ProvisionController;
	let provisionService: jest.Mocked<ProvisionService>;

	const mockUserTg = {
		id: 1,
		first_name: "Arsenij",
		role: Roles.BARBER
	} as unknown as TelegramUserDto;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProvisionController],
			providers: [
				{
					provide: ProvisionService,
					useValue: {
						create: jest.fn(),
						findAll: jest.fn(),
						findAllSortedByPrice: jest.fn(),
						findByUser: jest.fn(),
						findByIdAndFreeSlots: jest.fn(),
						deleteByUser: jest.fn(),
						findById: jest.fn(),
						deleteById: jest.fn()
					}
				},
				{
					provide: ConfigService,
					useValue: { get: jest.fn() }
				}
			]
		})
			.overrideGuard(TelegramAuthGuard)
			.useValue({ canActivate: () => true })
			.compile();

		controller = module.get<ProvisionController>(ProvisionController);
		provisionService = module.get(ProvisionService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("должен быть определен", () => {
		expect(controller).toBeDefined();
	});

	describe("create", () => {
		it("должен успешно вызвать создание через сервис", async () => {
			const dto: CreateProvisionRequestDto = {
				title: "Мужская стрижка",
				description: "Стильная стрижка",
				price: 1500,
				image: "haircut.jpg",
				categoryId: 1,
				time: ["2026-05-01T12:00:00Z"]
			};
			const expectedResponse = { id: 101 } as CreateProvisionResponseDto;
			provisionService.create.mockResolvedValueOnce(expectedResponse);

			const result = await controller.create(mockUserTg, dto);

			expect(provisionService.create).toHaveBeenCalledWith(
				dto,
				mockUserTg
			);
			expect(result).toBe(expectedResponse);
		});
	});

	describe("findAll", () => {
		it("должен вернуть массив всех доступных услуг", async () => {
			const expected = [
				{ id: 1, title: "Услуга 1" }
			] as ProvisionResponseDto[];
			provisionService.findAll.mockResolvedValueOnce(expected);

			const result = await controller.findAll();

			expect(provisionService.findAll).toHaveBeenCalled();
			expect(result).toBe(expected);
		});
	});

	describe("findAllSortByPrice", () => {
		it("должен вернуть отсортированный список", async () => {
			const query: SortProvisionPriceRequestDto = {
				order: SortOrder.ASC
			};
			provisionService.findAllSortedByPrice.mockResolvedValueOnce([]);

			await controller.findAllSortByPrice(query);

			expect(provisionService.findAllSortedByPrice).toHaveBeenCalledWith(
				query
			);
		});
	});

	describe("findMyProvisions", () => {
		it("должен искать услуги текущего мастера по его TG ID", async () => {
			await controller.findMyProvisions(mockUserTg);
			expect(provisionService.findByUser).toHaveBeenCalledWith(
				BigInt(mockUserTg.id)
			);
		});
	});

	describe("findByIdAndFreeSlots", () => {
		it("должен вернуть услугу с фильтрацией свободных слотов", async () => {
			const id = 777n;
			await controller.findByIdAndFreeSlots(id, SortOrder.DESC);
			expect(provisionService.findByIdAndFreeSlots).toHaveBeenCalledWith(
				id,
				SortOrder.DESC
			);
		});
	});

	describe("deleteMyProvisions", () => {
		it("должен вызвать массовое удаление услуг пользователя", async () => {
			const expectedResponse = { success: true } as DeleteResponseDto;
			provisionService.deleteByUser.mockResolvedValueOnce(
				expectedResponse
			);

			const result = await controller.deleteMyProvisions(mockUserTg);

			expect(provisionService.deleteByUser).toHaveBeenCalledWith(
				mockUserTg
			);
			expect(result).toBe(expectedResponse);
		});
	});

	describe("findById", () => {
		it("должен вернуть одну услугу по ее ID", async () => {
			const id = 1n;
			await controller.findById(id);
			expect(provisionService.findById).toHaveBeenCalledWith(id);
		});
	});

	describe("delete", () => {
		it("должен вызвать удаление конкретной услуги", async () => {
			const id = 5n;
			await controller.delete(id, mockUserTg);
			expect(provisionService.deleteById).toHaveBeenCalledWith(
				id,
				mockUserTg
			);
		});
	});
});
