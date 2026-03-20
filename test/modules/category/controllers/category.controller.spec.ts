/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { CategoryController } from "@/src/modules/category/controllers/category.controller";
import { CategoryService } from "@/src/modules/category/services/category.service";

describe("CategoryController", () => {
	let controller: CategoryController;
	let service: jest.Mocked<CategoryService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoryController],
			providers: [
				{
					provide: CategoryService,
					useValue: {
						create: jest.fn()
					}
				}
			]
		}).compile();

		controller = module.get(CategoryController);
		service = module.get(CategoryService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		const mockDto = { name: "Барберские услуги" };
		const mockResponse = { id: 1n, name: "Барберские услуги" };

		it("успех: категория создана", async () => {
			service.create.mockResolvedValueOnce(
				mockResponse as unknown as any
			);

			const result = await controller.create(mockDto);

			expect(result).toEqual(mockResponse);
			expect(service.create).toHaveBeenCalledWith(mockDto);
			expect(service.create).toHaveBeenCalledTimes(1);
		});

		it("ошибка: категория с таким названием уже существует", async () => {
			service.create.mockRejectedValue(
				new BadRequestException(
					"Категория с таким названием уже существует"
				)
			);

			await expect(controller.create(mockDto)).rejects.toThrow(
				BadRequestException
			);
			await expect(controller.create(mockDto)).rejects.toThrow(
				"Категория с таким названием уже существует"
			);
		});

		it("успех: создание с разными названиями", async () => {
			const dto1 = { name: "Категория 1" };
			const dto2 = { name: "Категория 2" };
			const response1 = { id: 1n, name: "Категория 1" };
			const response2 = { id: 2n, name: "Категория 2" };

			service.create
				.mockResolvedValueOnce(response1 as unknown as any)
				.mockResolvedValueOnce(response2 as unknown as any);

			const result1 = await controller.create(dto1);
			const result2 = await controller.create(dto2);

			expect(result1).toEqual(response1);
			expect(result2).toEqual(response2);
			expect(service.create).toHaveBeenCalledTimes(2);
		});
	});
});
