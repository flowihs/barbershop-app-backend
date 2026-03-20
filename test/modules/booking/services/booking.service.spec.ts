/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from "@nestjs/testing";
import { $Enums } from "@prisma/client";

import { AccountService } from "@/src/modules/account/services/account.service";
import { BookingRepository } from "@/src/modules/booking/repositories/booking.repository";
import { BookingService } from "@/src/modules/booking/services/booking.service";
import { ProvisionQueryService } from "@/src/modules/provision/services/provision-query.service";
import { SlotService } from "@/src/modules/slot/services/slot.service";
import { BookingMapper } from "@/src/shared/mappers/booking.mapper";

describe("BookingService", () => {
	let service: BookingService;
	let slotService: jest.Mocked<SlotService>;
	let bookingRepository: jest.Mocked<BookingRepository>;
	let accountService: jest.Mocked<AccountService>;
	let provisionQueryService: jest.Mocked<ProvisionQueryService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookingService,
				{
					provide: SlotService,
					useValue: {
						findByIdAndIncludeProvision: jest.fn()
					}
				},
				{
					provide: BookingRepository,
					useValue: {
						findById: jest.fn(),
						findAllByProvisionId: jest.fn(),
						bookSlotWithTransaction: jest.fn(),
						cancelBookingWithTransaction: jest.fn(),
						findByUser: jest.fn()
					}
				},
				{
					provide: AccountService,
					useValue: {
						findById: jest.fn()
					}
				},
				{
					provide: ProvisionQueryService,
					useValue: {
						findById: jest.fn()
					}
				}
			]
		}).compile();

		service = module.get(BookingService);
		slotService = module.get(SlotService);
		bookingRepository = module.get(BookingRepository);
		accountService = module.get(AccountService);
		provisionQueryService = module.get(ProvisionQueryService);

		jest.spyOn(BookingMapper, "toResponseList").mockImplementation(
			v => v as unknown as any
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("bookSlotById", () => {
		const slotId = 1n;
		const clientId = 123456789n;
		const mockSlot = {
			id: slotId,
			isBooking: false,
			provision: {
				userId: 100n,
				price: 5000
			}
		};

		it("успех: слот забронирован с clientId", async () => {
			slotService.findByIdAndIncludeProvision.mockResolvedValueOnce(
				mockSlot as unknown as any
			);
			bookingRepository.bookSlotWithTransaction.mockResolvedValueOnce({
				id: 1n,
				slotId,
				userId: clientId,
				totalPrice: 5000
			} as unknown as any);

			const result = await service.bookSlotById(slotId, clientId);

			expect(result.status).toBe(200);
			expect(result.message).toContain("успешно забронирован");
			expect(
				slotService.findByIdAndIncludeProvision
			).toHaveBeenCalledWith(slotId);
			expect(
				bookingRepository.bookSlotWithTransaction
			).toHaveBeenCalledWith(
				slotId,
				expect.objectContaining({
					userId: clientId,
					totalPrice: 5000
				})
			);
		});

		it("ошибка: слот уже забронирован", async () => {
			const bookedSlot = { ...mockSlot, isBooking: true };
			slotService.findByIdAndIncludeProvision.mockResolvedValue(
				bookedSlot as unknown as any
			);
			bookingRepository.bookSlotWithTransaction.mockRejectedValueOnce(
				new Error("Slot is already booked")
			);

			await expect(
				service.bookSlotById(slotId, clientId)
			).rejects.toThrow("Слот уже забронирован");
		});
	});

	describe("cancelledBookSlotById", () => {
		const bookingId = 1n;
		const userId = 123456789;

		it("успех: бронирование отменено", async () => {
			const mockBooking = {
				id: bookingId,
				userId: BigInt(userId),
				status: $Enums.BookingStatus.CONFIRMED,
				slot: {
					id: 1n,
					provisionId: 1n
				}
			};

			const mockProvision = {
				id: 1n,
				user: {
					id: BigInt(userId)
				}
			};

			bookingRepository.findById.mockResolvedValueOnce(
				mockBooking as unknown as any
			);
			provisionQueryService.findById.mockResolvedValueOnce(
				mockProvision as unknown as any
			);
			accountService.findById.mockResolvedValueOnce({} as unknown as any);
			bookingRepository.cancelBookingWithTransaction.mockResolvedValueOnce(
				undefined
			);

			const result = await service.cancelledBookSlotById(
				bookingId,
				userId
			);

			expect(result.status).toBe(200);
			expect(result.message).toContain("успешно отменено");
			expect(bookingRepository.findById).toHaveBeenCalledWith(bookingId);
			expect(
				bookingRepository.cancelBookingWithTransaction
			).toHaveBeenCalled();
		});

		it("ошибка: бронирование уже отменено", async () => {
			const mockBooking = {
				id: bookingId,
				userId: BigInt(userId),
				status: $Enums.BookingStatus.CANCELLED,
				slot: {
					id: 1n,
					provisionId: 1n
				}
			};

			const mockProvision = {
				id: 1n,
				user: {
					id: BigInt(userId)
				}
			};

			bookingRepository.findById.mockResolvedValue(
				mockBooking as unknown as any
			);
			provisionQueryService.findById.mockResolvedValueOnce(
				mockProvision as unknown as any
			);
			accountService.findById.mockResolvedValueOnce({} as unknown as any);

			await expect(
				service.cancelledBookSlotById(bookingId, userId)
			).rejects.toThrow("Вы уже отказались от услуги");
		});

		it("ошибка: нельзя отменить выполненную услугу", async () => {
			const mockBooking = {
				id: bookingId,
				userId: BigInt(userId),
				status: $Enums.BookingStatus.COMPLETED,
				slot: {
					id: 1n,
					provisionId: 1n
				}
			};

			const mockProvision = {
				id: 1n,
				user: {
					id: BigInt(userId)
				}
			};

			bookingRepository.findById.mockResolvedValue(
				mockBooking as unknown as any
			);
			provisionQueryService.findById.mockResolvedValueOnce(
				mockProvision as unknown as any
			);
			accountService.findById.mockResolvedValueOnce({} as unknown as any);

			await expect(
				service.cancelledBookSlotById(bookingId, userId)
			).rejects.toThrow("Нельзя отменить выполненную услугу");
		});

		it("ошибка: неавторизованный пользователь не может отменить", async () => {
			const mockBooking = {
				id: bookingId,
				userId: 999999n,
				status: $Enums.BookingStatus.CONFIRMED,
				slot: {
					id: 1n,
					provisionId: 1n
				}
			};

			const mockProvision = {
				id: 1n,
				user: {
					id: 999999n
				}
			};

			bookingRepository.findById.mockResolvedValue(
				mockBooking as unknown as any
			);
			provisionQueryService.findById.mockResolvedValue(
				mockProvision as unknown as any
			);
			accountService.findById.mockResolvedValue({} as unknown as any);

			await expect(
				service.cancelledBookSlotById(bookingId, userId)
			).rejects.toThrow("не можете отменить");
		});
	});

	describe("findByUser", () => {
		const userId = 123456789n;

		it("успех: получены все бронирования пользователя", async () => {
			const mockBookings = [
				{
					id: 1n,
					userId,
					status: $Enums.BookingStatus.CONFIRMED,
					totalPrice: 1500
				}
			];

			bookingRepository.findByUser.mockResolvedValueOnce(
				mockBookings as unknown as any
			);

			const result = await service.findByUser(userId);

			expect(result).toBeDefined();
			expect(bookingRepository.findByUser).toHaveBeenCalledWith(userId);
		});

		it("ошибка: пользователь не имеет бронирований", async () => {
			bookingRepository.findByUser.mockResolvedValue([]);

			await expect(service.findByUser(userId)).rejects.toThrow(
				"не были найдены забронированные услуги"
			);
		});
	});

	describe("findById", () => {
		const bookingId = 1n;

		it("успех: бронирование найдено", async () => {
			const mockBooking = {
				id: bookingId,
				status: $Enums.BookingStatus.CONFIRMED
			};

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
				"не была найдена по данному id"
			);
		});
	});
});
