/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { ProvisionRepository } from "@/src/modules/provision/repositories/provision.repository";
import { SlotRepository } from "@/src/modules/slot/repositories/slot.repository";
import { SlotService } from "@/src/modules/slot/services/slot.service";
import { SlotMapper } from "@/src/shared/mappers";

describe("SlotService", () => {
	let service: SlotService;
	let slotRepository: jest.Mocked<SlotRepository>;
	let provisionRepository: jest.Mocked<ProvisionRepository>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlotService,
				{
					provide: SlotRepository,
					useValue: {
						create: jest.fn(),
						findById: jest.fn(),
						findByIdAndIncludeProvision: jest.fn(),
						deleteById: jest.fn(),
						changeSlotBookingStatusById: jest.fn()
					}
				},
				{
					provide: ProvisionRepository,
					useValue: {
						findById: jest.fn()
					}
				}
			]
		}).compile();

		service = module.get(SlotService);
		slotRepository = module.get(SlotRepository);
		provisionRepository = module.get(ProvisionRepository);

		jest.spyOn(SlotMapper, "toCreateData").mockImplementation(
			() =>
				({
					provisionId: 1n,
					time: new Date(),
					isBooking: false
				}) as unknown as any
		);
		jest.spyOn(SlotMapper, "toCreateResponseDto").mockImplementation(
			v => v as unknown as any
		);
		jest.spyOn(SlotMapper, "toResponse").mockImplementation(
			v => v as unknown as any
		);
		jest.spyOn(SlotMapper, "toResponseIncludeProvision").mockImplementation(
			v => v as unknown as any
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		const mockDto = {
			provisionId: 1,
			time: new Date(Date.now() + 86400000).toISOString()
		};

		const mockSlot = {
			id: 1n,
			provisionId: 1n,
			time: new Date(),
			isBooking: false
		};

		it("успех: слот создан", async () => {
			provisionRepository.findById.mockResolvedValueOnce({
				id: 1n
			} as unknown as any);
			slotRepository.create.mockResolvedValueOnce(
				mockSlot as unknown as any
			);

			const result = await service.create(mockDto as unknown as any);

			expect(result).toEqual(mockSlot);
			expect(provisionRepository.findById).toHaveBeenCalled();
			expect(slotRepository.create).toHaveBeenCalled();
		});
	});

	describe("deleteById", () => {
		const slotId = 1n;
		const mockSlot = {
			id: slotId,
			time: new Date(),
			isBooking: false
		};

		it("успех: слот удален", async () => {
			slotRepository.findById.mockResolvedValueOnce(
				mockSlot as unknown as any
			);
			slotRepository.deleteById.mockResolvedValueOnce(
				undefined as unknown as any
			);

			const result = await service.deleteById(slotId);

			expect(result.success).toBe(true);
			expect(result.message).toBe("Слот был удален успешно");
			expect(slotRepository.deleteById).toHaveBeenCalledWith(slotId);
		});

		it("ошибка: слот не найден", async () => {
			slotRepository.findById.mockResolvedValue(null as unknown as any);

			await expect(service.deleteById(slotId)).rejects.toThrow(
				NotFoundException
			);
		});
	});

	describe("findById", () => {
		const slotId = 1n;
		const mockSlot = {
			id: slotId,
			time: new Date(),
			isBooking: false
		};

		it("успех: слот найден", async () => {
			slotRepository.findById.mockResolvedValueOnce(
				mockSlot as unknown as any
			);

			const result = await service.findById(slotId);

			expect(result).toEqual(mockSlot);
			expect(slotRepository.findById).toHaveBeenCalledWith(slotId);
			expect(SlotMapper.toResponse).toHaveBeenCalledWith(mockSlot);
		});

		it("ошибка: слот не найден", async () => {
			slotRepository.findById.mockResolvedValue(null as unknown as any);

			await expect(service.findById(slotId)).rejects.toThrow(
				NotFoundException
			);
			await expect(service.findById(slotId)).rejects.toThrow(
				"Слот не был найден по данному id"
			);
		});
	});

	describe("findByIdAndIncludeProvision", () => {
		const slotId = 1n;
		const mockSlot = {
			id: slotId,
			time: new Date(),
			isBooking: false,
			provision: { id: 1n, userId: 100n, price: 5000 }
		};

		it("успех: слот с услугой найден", async () => {
			slotRepository.findByIdAndIncludeProvision.mockResolvedValueOnce(
				mockSlot as unknown as any
			);

			const result = await service.findByIdAndIncludeProvision(slotId);

			expect(result).toEqual(mockSlot);
			expect(
				slotRepository.findByIdAndIncludeProvision
			).toHaveBeenCalledWith(slotId);
		});

		it("ошибка: слот не найден", async () => {
			slotRepository.findByIdAndIncludeProvision.mockResolvedValue(
				null as unknown as any
			);

			await expect(
				service.findByIdAndIncludeProvision(slotId)
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("changeSlotBookingStatusById", () => {
		const slotId = 1n;

		it("успех: статус бронирования изменен на true", async () => {
			const mockSlot = {
				id: slotId,
				isBooking: false,
				time: new Date()
			};

			slotRepository.findById.mockResolvedValueOnce(
				mockSlot as unknown as any
			);
			slotRepository.changeSlotBookingStatusById.mockResolvedValueOnce(
				undefined as unknown as any
			);

			const result = await service.changeSlotBookingStatusById(
				slotId,
				true
			);

			expect(result.status).toBe("success");
			expect(
				slotRepository.changeSlotBookingStatusById
			).toHaveBeenCalledWith(slotId, true);
		});

		it("успех: статус бронирования изменен на false", async () => {
			const mockSlot = {
				id: slotId,
				isBooking: true,
				time: new Date()
			};

			slotRepository.findById.mockResolvedValueOnce(
				mockSlot as unknown as any
			);
			slotRepository.changeSlotBookingStatusById.mockResolvedValueOnce(
				undefined as unknown as any
			);

			const result = await service.changeSlotBookingStatusById(
				slotId,
				false
			);

			expect(result.status).toBe("success");
			expect(
				slotRepository.changeSlotBookingStatusById
			).toHaveBeenCalledWith(slotId, false);
		});

		it("ошибка: статус уже имеет данное значение", async () => {
			const mockSlot = {
				id: slotId,
				isBooking: true,
				time: new Date()
			};

			slotRepository.findById.mockResolvedValue(
				mockSlot as unknown as any
			);

			await expect(
				service.changeSlotBookingStatusById(slotId, true)
			).rejects.toThrow(BadRequestException);
			await expect(
				service.changeSlotBookingStatusById(slotId, true)
			).rejects.toThrow("Статус уже имеет данное значение");
		});
	});
});
