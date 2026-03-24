/* eslint-disable @typescript-eslint/unbound-method */
import {
	BadRequestException,
	CanActivate,
	NotFoundException
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { SlotController } from "@/src/modules/slot/controllers/slot.controller";
import { CreateSlotRequestDto } from "@/src/modules/slot/dto/create-slot-request.dto";
import { CreateSlotResponseDto } from "@/src/modules/slot/dto/create-slot-response.dto";
import { DeleteSlotResponseDto } from "@/src/modules/slot/dto/delete-slot-response.dto";
import { SlotService } from "@/src/modules/slot/services/slot.service";
import { TelegramAuthGuard } from "@/src/shared/guards/auth.guard";

describe("SlotController", () => {
	let controller: SlotController;
	let service: jest.Mocked<SlotService>;

	const mockCreateSlotResponse: CreateSlotResponseDto = {
		id: 1,
		time: new Date("2024-01-20T10:00:00Z"),
		isBooking: false
	};

	const mockDeleteSlotResponse: DeleteSlotResponseDto = {
		message: "Слот был удален успешно",
		success: true
	};

	const mockGuard: CanActivate = {
		canActivate: jest.fn(() => true)
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SlotController],
			providers: [
				{
					provide: SlotService,
					useValue: {
						create: jest.fn(),
						deleteById: jest.fn()
					}
				}
			]
		})
			.overrideGuard(TelegramAuthGuard)
			.useValue(mockGuard)
			.compile();

		controller = module.get(SlotController);
		service = module.get(SlotService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		const mockDto: CreateSlotRequestDto = {
			time: "2024-01-20T10:00:00Z",
			provisionId: 1
		};

		it("успех: слот создан", async () => {
			service.create.mockResolvedValueOnce(mockCreateSlotResponse);

			const result = await controller.create(mockDto);

			expect(result).toEqual(mockCreateSlotResponse);
			expect(service.create).toHaveBeenCalledWith(mockDto);
			expect(service.create).toHaveBeenCalledTimes(1);
		});

		it("ошибка: услуга не найдена", async () => {
			service.create.mockRejectedValue(
				new NotFoundException("Услуга не найдена")
			);

			await expect(controller.create(mockDto)).rejects.toThrow(
				NotFoundException
			);
		});

		it("ошибка: неверный формат времени", async () => {
			service.create.mockRejectedValue(
				new BadRequestException("Неверный формат времени")
			);

			await expect(controller.create(mockDto)).rejects.toThrow(
				BadRequestException
			);
		});

		it("ошибка: время в прошлом", async () => {
			service.create.mockRejectedValue(
				new BadRequestException("Время не может быть в прошлом")
			);

			await expect(controller.create(mockDto)).rejects.toThrow(
				BadRequestException
			);
		});

		it("успех: создание нескольких слотов", async () => {
			const dto1: CreateSlotRequestDto = {
				time: "2024-01-20T10:00:00Z",
				provisionId: 1
			};
			const dto2: CreateSlotRequestDto = {
				time: "2024-01-20T11:00:00Z",
				provisionId: 1
			};
			const response1: CreateSlotResponseDto = {
				id: 1,
				time: new Date("2024-01-20T10:00:00Z"),
				isBooking: false
			};
			const response2: CreateSlotResponseDto = {
				id: 2,
				time: new Date("2024-01-20T11:00:00Z"),
				isBooking: false
			};

			service.create
				.mockResolvedValueOnce(response1)
				.mockResolvedValueOnce(response2);

			const result1 = await controller.create(dto1);
			const result2 = await controller.create(dto2);

			expect(result1).toEqual(response1);
			expect(result2).toEqual(response2);
			expect(service.create).toHaveBeenCalledTimes(2);
		});
	});

	describe("deleteById", () => {
		const slotId = 1n;

		it("успех: слот удален", async () => {
			service.deleteById.mockResolvedValueOnce(mockDeleteSlotResponse);

			const result = await controller.deleteById(slotId);

			expect(result).toEqual(mockDeleteSlotResponse);
			expect(service.deleteById).toHaveBeenCalledWith(slotId);
			expect(service.deleteById).toHaveBeenCalledTimes(1);
		});

		it("ошибка: слот не найден", async () => {
			service.deleteById.mockRejectedValue(
				new NotFoundException("Слот не найден")
			);

			await expect(controller.deleteById(slotId)).rejects.toThrow(
				NotFoundException
			);
		});

		it("ошибка: не удалось удалить слот", async () => {
			service.deleteById.mockRejectedValue(
				new BadRequestException("Не удалось удалить слот")
			);

			await expect(controller.deleteById(slotId)).rejects.toThrow(
				BadRequestException
			);
		});

		it("успех: удаление нескольких слотов", async () => {
			const id1 = 1n;
			const id2 = 2n;
			const response1: DeleteSlotResponseDto = {
				message: "Слот был удален успешно",
				success: true
			};
			const response2: DeleteSlotResponseDto = {
				message: "Слот был удален успешно",
				success: true
			};

			service.deleteById
				.mockResolvedValueOnce(response1)
				.mockResolvedValueOnce(response2);

			const result1 = await controller.deleteById(id1);
			const result2 = await controller.deleteById(id2);

			expect(result1).toEqual(response1);
			expect(result2).toEqual(response2);
			expect(service.deleteById).toHaveBeenCalledTimes(2);
		});
	});
});
