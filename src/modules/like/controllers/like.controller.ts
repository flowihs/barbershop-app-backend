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

import { Authorization } from "../../../shared/decorators/authorization.decorator";
import { UserInfo } from "../../../shared/decorators/user.decorator";
import { TelegramAuthGuard } from "../../../shared/guards/auth.guard";
import { ParseBigIntPipe } from "../../../shared/pipes/parse-bigint.pipe";
import { TelegramUserDto } from "../../account/dto/telegram-user.dto";
import { ToggleLikeRequestDto } from "../dto/toggle-like-request.dto";
import { ToggleLikeResponseDto } from "../dto/toggle-like-response.dto";
import { LikeService } from "../services/like.service";

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
		@UserInfo() user: TelegramUserDto,
		@Body() dto: ToggleLikeRequestDto
	): Promise<ToggleLikeResponseDto> {
		return this.likeService.toggleLiked(user.id, dto);
	}

	@Get("my")
	@ApiOperation({
		summary: "Получить все свои лайки",
		description: "Возвращает список всех лайков текущего пользователя"
	})
	public async findMyLikes(@UserInfo() user: TelegramUserDto) {
		return this.likeService.findByUserId(BigInt(user.id));
	}

	@Get(":id")
	public async findById(@Param("id", ParseBigIntPipe) id: bigint) {
		return this.likeService.findById(id);
	}

	@Get("target/:targetId")
	@ApiOperation({
		summary: "Проверить лайк",
		description:
			"Проверяет наличие лайка у текущего пользователя для указанного обьекта"
	})
	public async checkLike(
		@UserInfo() user: TelegramUserDto,
		@Param("targetId", ParseBigIntPipe) targetId: bigint
	) {
		return this.likeService.findByTargetIdAndUserId(
			targetId,
			BigInt(user.id)
		);
	}
}
