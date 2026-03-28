import { Provision, Slot } from "@prisma/client";
import { CreateSlotRequestDto } from "../../modules/slot/dto/create-slot-request.dto";
import { CreateSlotResponseDto } from "../../modules/slot/dto/create-slot-response.dto";
import { SlotResponseDto } from "../../modules/slot/dto/slot-response.dto";

export class SlotMapper {
	static toResponseList(slots: Slot[]): SlotResponseDto[] {
		return slots.map(slot => ({
			id: Number(slot.id),
			time: slot.time,
			isBooking: slot.isBooking
		}));
	}

	static toResponse(slot: Slot): SlotResponseDto {
		return {
			id: Number(slot.id),
			time: slot.time,
			isBooking: slot.isBooking
		};
	}

	static toResponseIncludeProvision(
		slot: Slot & {
			provision: Provision;
		}
	) {
		return {
			id: Number(slot.id),
			time: slot.time,
			isBooking: slot.isBooking,
			provision: slot.provision
		};
	}

	static toCreateResponseDto(slot: Slot): CreateSlotResponseDto {
		return {
			id: Number(slot.id),
			time: slot.time,
			isBooking: slot.isBooking
		};
	}

	static toCreateData(dto: CreateSlotRequestDto) {
		return {
			time: dto.time,
			provisionId: BigInt(dto.provisionId)
		};
	}
}
