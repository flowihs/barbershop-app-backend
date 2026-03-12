import { Slot } from "@/generated";
import { SlotResponseDto } from "@/src/modules/slot/dto/slot-response.dto";

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
}
