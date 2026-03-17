/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from "@nestjs/testing";

import { $Enums } from "@/generated";
import { BookingRepository } from "@/src/modules/booking/repositories/booking.repository";
import { BookingService } from "@/src/modules/booking/services/booking.service";
import { SlotService } from "@/src/modules/slot/services/slot.service";
import { BookingMapper } from "@/src/shared/mappers/booking.mapper";

describe("BookingService", () => {
	let service: BookingService;
	let slotService: jest.Mocked<SlotService>;
	let bookingRepository: jest.Mocked<BookingRepository>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookingService,
				{
					provide: SlotService,
					useValue: {
						findByIdAndIncludeProvision: jest.fn(),
						changeSlotBookingStatusById: jest.fn()
					}
				},
				{
					provide: BookingRepository,
					useValue: {
						create: jest.fn(),
						findById: jest.fn(),
						findAllByProvisionId: jest.fn(),
						update: jest.fn()
					}
				}
			]
		}).compile();

		service = module.get(BookingService);
		slotService = module.get(SlotService);
		bookingRepository = module.get(BookingRepository);

		jest.spyOn(BookingMapper, "toResponseList").mockImplementation(
			v => v as unknown as any
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("bookSlotById", () => {
		const slotId = 1n;
		const mockSlot = {
			id: slotId,
			isBooking: false,
			provision: {
				userId: 100n,
				price: 5000
			}
		};

		const mockBooking = {
			id: 1n,
			slotId: slotId,
			userId: 100n,
			totalPrice: 5000,
			status: $Enums.BookingStatus.COMPLETED
		};

		it("успех: слот забронирован", async () => {
			slotService.findByIdAndIncludeProvision.mockResolvedValueOnce(
				mockSlot as unknown as any
			);
			slotService.changeSlotBookingStatusById.mockResolvedValueOnce({
				status: "success",
				message: "Статус бронирования для слота был успешно изменен"
			} as unknown as any);
			bookingRepository.create.mockResolvedValueOnce(
				mockBooking as unknown as any
			);

			const result = await service.bookSlotById(slotId);

			expect(result.status).toBe(200);
			expect(result.message).toBe("Слот был успешно забронирован");
			expect(
				slotService.findByIdAndIncludeProvision
			).toHaveBeenCalledWith(slotId);
			expect(
				slotService.changeSlotBookingStatusById
			).toHaveBeenCalledWith(slotId, true);
			expect(bookingRepository.create).toHaveBeenCalledWith({
				slotId: slotId,
				userId: 100n,
				totalPrice: 5000
			});
		});

		it("ошибка: слот уже забронирован", async () => {
			const bookedSlot = { ...mockSlot, isBooking: true };
			slotService.findByIdAndIncludeProvision.mockResolvedValue(
				bookedSlot as unknown as any
			);

			await expect(service.bookSlotById(slotId)).rejects.toThrow(
				"Слот уже забронирован"
			);
		});

		it("ошибка: ошибка при создании записи", async () => {
			slotService.findByIdAndIncludeProvision.mockResolvedValue(
				mockSlot as unknown as any
			);
			slotService.changeSlotBookingStatusById.mockResolvedValue({
				status: "success",
				message: "Статус бронирования для слота был успешно изменен"
			} as unknown as any);
			bookingRepository.create.mockResolvedValue(null as unknown as any);

			await expect(service.bookSlotById(slotId)).rejects.toThrow(
				"Произошла ошибка при попытке создании записи"
			);
		});
	});

	describe("cancelledBookSlotById", () => {
		const bookingId = 1n;

		it("успех: бронирование отменено", async () => {
			const mockBooking = {
				id: bookingId,
				status: $Enums.BookingStatus.CONFIRMED
			};
			const updateResult = { success: true };

			bookingRepository.findById.mockResolvedValueOnce(
				mockBooking as unknown as any
			);
			bookingRepository.update.mockResolvedValueOnce(
				updateResult as unknown as any
			);

			const result = await service.cancelledBookSlotById(bookingId);

			expect(result).toEqual(updateResult);
			expect(bookingRepository.findById).toHaveBeenCalledWith(bookingId);
			expect(bookingRepository.update).toHaveBeenCalledWith(
				bookingId,
				expect.objectContaining({
					status: $Enums.BookingStatus.CANCELLED
				})
			);
		});

		it("ошибка: бронирование уже отменено", async () => {
			const mockBooking = {
				id: bookingId,
				status: $Enums.BookingStatus.CANCELLED
			};

			bookingRepository.findById.mockResolvedValue(
				mockBooking as unknown as any
			);

			await expect(
				service.cancelledBookSlotById(bookingId)
			).rejects.toThrow("Вы уже отказались от услуги");
		});

		it("ошибка: нельзя отменить выполненную услугу", async () => {
			const mockBooking = {
				id: bookingId,
				status: $Enums.BookingStatus.COMPLETED
			};

			bookingRepository.findById.mockResolvedValue(
				mockBooking as unknown as any
			);

			await expect(
				service.cancelledBookSlotById(bookingId)
			).rejects.toThrow("Нельзя отменить выполненную услугу");
		});
	});

	describe("getAllByProvision", () => {
		const provisionId = 1n;
		const mockBookings = [
			{
				id: 1n,
				slotId: 1n,
				userId: 100n,
				totalPrice: 5000,
				status: $Enums.BookingStatus.COMPLETED
			},
			{
				id: 2n,
				slotId: 2n,
				userId: 100n,
				totalPrice: 6000,
				status: $Enums.BookingStatus.CONFIRMED
			}
		];

		it("успех: получены все бронирования", async () => {
			bookingRepository.findAllByProvisionId.mockResolvedValueOnce(
				mockBookings as unknown as any
			);

			const result = await service.getAllByProvision(provisionId);

			expect(result).toEqual(mockBookings);
			expect(bookingRepository.findAllByProvisionId).toHaveBeenCalledWith(
				provisionId
			);
			expect(BookingMapper.toResponseList).toHaveBeenCalledWith(
				mockBookings
			);
		});

		it("успех: пустой список бронирований", async () => {
			bookingRepository.findAllByProvisionId.mockResolvedValueOnce([]);

			const result = await service.getAllByProvision(provisionId);

			expect(result).toEqual([]);
			expect(bookingRepository.findAllByProvisionId).toHaveBeenCalledWith(
				provisionId
			);
		});
	});

	describe("findById", () => {
		const bookingId = 1n;
		const mockBooking = {
			id: bookingId,
			slotId: 1n,
			userId: 100n,
			totalPrice: 5000,
			status: $Enums.BookingStatus.COMPLETED
		};

		it("успех: бронирование найдено", async () => {
			bookingRepository.findById.mockResolvedValueOnce(
				mockBooking as unknown as any
			);

			const result = await service.findById(bookingId);

			expect(result).toEqual(mockBooking);
			expect(bookingRepository.findById).toHaveBeenCalledWith(bookingId);
		});

		it("ошибка: бронирование не найдено", async () => {
			bookingRepository.findById.mockResolvedValue(null);

			await expect(service.findById(bookingId)).rejects.toThrow(
				"Запись не была найдена по данному id"
			);
		});
	});
});
