import { TelegramProfileDto } from "@/src/modules/account/dto/telegram-profile.dto";
import { SlotResponseDto } from "@/src/modules/slot/dto/slot-response.dto";

export class BookingResponseDto {
	id: number;
	status: string;
	totalPrice: number;
	cancelledAt?: string;
	slot: SlotResponseDto;
	user: TelegramProfileDto;
}
