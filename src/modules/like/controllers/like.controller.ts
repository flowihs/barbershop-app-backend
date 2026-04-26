import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	UseGuards
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags
} from "@nestjs/swagger";

import { LikeService } from "../services/like.service";

import { ToggleLikeRequestDto } from "@/modules/like/dto/toggle-like-request.dto";
import { ToggleLikeResponseDto } from "@/modules/like/dto/toggle-like-response.dto";
import { Authorization } from "@/shared/decorators/authorization.decorator";
import { TelegramAuthGuard } from "@/shared/guards/auth.guard";
import { ParseBigIntPipe } from "@/shared/pipes/parse-bigint.pipe";

@ApiTags("Likes (Лайки)")
@ApiBearerAuth()
@Authorization()
@Controller("likes")
@UseGuards(TelegramAuthGuard)
export class LikeController {
	constructor(private readonly likeService: LikeService) {}

	@Post("toggle")
	@ApiOperation({
		summary: "Переключить статус лайка",
		description:
			"Переключает статус лайка: если лайк существует, удаляет его и возвращает liked: false; если не существует, создает его и возвращает liked: true."
	})
	@ApiBody({ type: ToggleLikeRequestDto })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Статус лайка успешно переключен",
		type: ToggleLikeResponseDto
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			"Ошибка валидации (пользователь не найден, ошибка при создании)"
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "Пользователь не авторизован"
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: "Пользователь с указанным ID не найден"
	})
	public async toggleLiked(
		@Body() dto: ToggleLikeRequestDto
	): Promise<ToggleLikeResponseDto> {
		return this.likeService.toggleLiked(dto);
	}

	@Get(":userId")
	public async findByUser(@Param("userId", ParseBigIntPipe) userId: bigint) {
		return this.likeService.findById(userId);
	}
}
