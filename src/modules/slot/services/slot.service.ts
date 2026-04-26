import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";

import { ProvisionRepository } from "@/modules/provision/repositories/provision.repository";
import { CreateSlotRequestDto } from "@/modules/slot/dto/create-slot-request.dto";
import { CreateSlotResponseDto } from "@/modules/slot/dto/create-slot-response.dto";
import { SlotRepository } from "@/modules/slot/repositories/slot.repository";
import { SlotMapper } from "@/shared/mappers";

@Injectable()
export class SlotService {
	constructor(
		private readonly slotRepository: SlotRepository,
		private readonly provisionRepository: ProvisionRepository
	) {}

	public async create(
		dto: CreateSlotRequestDto
	): Promise<CreateSlotResponseDto> {
		const data = SlotMapper.toCreateData(dto);

		await this.provisionRepository.findById(data.provisionId);

		return SlotMapper.toCreateResponseDto(
			await this.slotRepository.create(data)
		);
	}

	public async deleteById(id: bigint) {
		await this.findById(id);

		await this.slotRepository.deleteById(id);

		return {
			message: "Слот был удален успешно",
			success: true
		};
	}

	public async findById(id: bigint) {
		const slot = await this.slotRepository.findById(id);

		if (!slot) {
			throw new NotFoundException("Слот не был найден по данному id");
		}

		return SlotMapper.toResponse(slot);
	}

	public async findByIdAndIncludeProvision(id: bigint) {
		const slot = await this.slotRepository.findByIdAndIncludeProvision(id);

		if (!slot) {
			throw new NotFoundException("Слот не был найден по данному id");
		}

		return SlotMapper.toResponseIncludeProvision(slot);
	}

	public async changeSlotBookingStatusById(
		id: bigint,
		isBookingStatus: boolean
	) {
		const slot = await this.findById(id);

		if (slot.isBooking === isBookingStatus) {
			throw new BadRequestException("Статус уже имеет данное значение");
		}

		await this.slotRepository.changeSlotBookingStatusById(
			id,
			isBookingStatus
		);

		return {
			status: "success",
			message: "Статус бронирования для слота был успешно изменен"
		};
	}
}
