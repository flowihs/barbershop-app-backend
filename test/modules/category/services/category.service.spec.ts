/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { CategoryRepository } from "@/src/modules/category/repositories/category.repository";
import { CategoryService } from "@/src/modules/category/services/category.service";
import { CategoryMapper } from "@/src/shared/mappers";

describe("CategoryService", () => {
	let service: CategoryService;
	let categoryRepository: jest.Mocked<CategoryRepository>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CategoryService,
				{
					provide: CategoryRepository,
					useValue: {
						create: jest.fn(),
						findById: jest.fn(),
						findByName: jest.fn(),
						findAll: jest.fn(),
						deleteById: jest.fn(),
						deleteByName: jest.fn()
					}
				}
			]
		}).compile();

		service = module.get(CategoryService);
		categoryRepository = module.get(CategoryRepository);

		jest.spyOn(CategoryMapper, "toCreateResponseDto").mockImplementation(
			v => v as unknown as any
		);
		jest.spyOn(CategoryMapper, "toReponseList").mockImplementation(
			v => v as unknown as any
		);
		jest.spyOn(CategoryMapper, "toResponse").mockImplementation(
			v => v as unknown as any
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("create", () => {
		const mockDto = { name: "Барберские услуги" };
		const mockCategory = { id: 1n, name: "Барберские услуги" };

		it("успех: категория создана", async () => {
			categoryRepository.findByName.mockResolvedValueOnce(
				null as unknown as any
			);
			categoryRepository.create.mockResolvedValueOnce(
				mockCategory as unknown as any
			);

			const result = await service.create(mockDto);

			expect(result).toEqual(mockCategory);
			expect(categoryRepository.findByName).toHaveBeenCalledWith(
				mockDto.name
			);
			expect(categoryRepository.create).toHaveBeenCalledWith(
				mockDto.name
			);
		});

		it("ошибка: категория с таким названием уже существует", async () => {
			categoryRepository.findByName.mockResolvedValue(
				mockCategory as unknown as any
			);

			await expect(service.create(mockDto)).rejects.toThrow(
				BadRequestException
			);
			await expect(service.create(mockDto)).rejects.toThrow(
				"Категория с таким названием уже существует"
			);
		});
	});

	describe("findAll", () => {
		const mockCategories = [
			{ id: 1n, name: "Барберские услуги" },
			{ id: 2n, name: "Парикмахерские услуги" }
		];

		it("успех: получены все категории", async () => {
			categoryRepository.findAll.mockResolvedValueOnce(
				mockCategories as unknown as any
			);

			const result = await service.findAll();

			expect(result).toEqual(mockCategories);
			expect(categoryRepository.findAll).toHaveBeenCalled();
			expect(CategoryMapper.toReponseList).toHaveBeenCalledWith(
				mockCategories
			);
		});

		it("ошибка: список категорий пуст", async () => {
			categoryRepository.findAll.mockResolvedValue([]);

			await expect(service.findAll()).rejects.toThrow(NotFoundException);
			await expect(service.findAll()).rejects.toThrow(
				"Список категорий пуст"
			);
		});
	});

	describe("findById", () => {
		const categoryId = 1n;
		const mockCategory = { id: categoryId, name: "Барберские услуги" };

		it("успех: категория найдена", async () => {
			categoryRepository.findById.mockResolvedValueOnce(
				mockCategory as unknown as any
			);

			const result = await service.findById(categoryId);

			expect(result).toEqual(mockCategory);
			expect(categoryRepository.findById).toHaveBeenCalledWith(
				categoryId
			);
			expect(CategoryMapper.toResponse).toHaveBeenCalledWith(
				mockCategory
			);
		});

		it("ошибка: категория не найдена", async () => {
			categoryRepository.findById.mockResolvedValue(
				null as unknown as any
			);

			await expect(service.findById(categoryId)).rejects.toThrow(
				NotFoundException
			);
		});
	});

	describe("findByName", () => {
		const categoryName = "Барберские услуги";
		const mockCategory = { id: 1n, name: categoryName };

		it("успех: категория найдена по названию", async () => {
			categoryRepository.findByName.mockResolvedValueOnce(
				mockCategory as unknown as any
			);

			const result = await service.findByName(categoryName);

			expect(result).toEqual(mockCategory);
			expect(categoryRepository.findByName).toHaveBeenCalledWith(
				categoryName
			);
		});

		it("ошибка: категория с таким названием не найдена", async () => {
			categoryRepository.findByName.mockResolvedValue(
				null as unknown as any
			);

			await expect(service.findByName(categoryName)).rejects.toThrow(
				NotFoundException
			);
		});
	});

	describe("deleteById", () => {
		const categoryId = 1n;
		const mockCategory = { id: categoryId, name: "Барберские услуги" };

		it("успех: категория удалена", async () => {
			categoryRepository.findById.mockResolvedValueOnce(
				mockCategory as unknown as any
			);
			categoryRepository.deleteById.mockResolvedValueOnce(
				undefined as unknown as any
			);

			const result = await service.deleteById(categoryId);

			expect(result).toBe(true);
			expect(categoryRepository.deleteById).toHaveBeenCalledWith(
				categoryId
			);
		});

		it("ошибка: категория не найдена", async () => {
			categoryRepository.findById.mockResolvedValue(
				null as unknown as any
			);

			await expect(service.deleteById(categoryId)).rejects.toThrow(
				NotFoundException
			);
		});
	});

	describe("deleteByName", () => {
		const categoryName = "Барберские услуги";
		const mockCategory = { id: 1n, name: categoryName };

		it("успех: категория удалена по названию", async () => {
			categoryRepository.findByName.mockResolvedValueOnce(
				mockCategory as unknown as any
			);
			categoryRepository.deleteByName.mockResolvedValueOnce(
				undefined as unknown as any
			);

			const result = await service.deleteByName(categoryName);

			expect(result).toBe(true);
			expect(categoryRepository.deleteByName).toHaveBeenCalledWith(
				categoryName
			);
		});

		it("ошибка: категория не найдена", async () => {
			categoryRepository.findByName.mockResolvedValue(
				null as unknown as any
			);

			await expect(service.deleteByName(categoryName)).rejects.toThrow(
				NotFoundException
			);
		});
	});
});
