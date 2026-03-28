import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";

import { AccountService } from "@/src/modules/account/services/account.service";
import { CreateLikeRequestDto } from "@/src/modules/like/dto/create-like-request.dto";
import { DeleteLikeRequestDto } from "@/src/modules/like/dto/delete-like-request.dto";
import { ToggleLikeRequestDto } from "@/src/modules/like/dto/toggle-like-request.dto";
import { LikeRepository } from "@/src/modules/like/repositories/like.repository";

@Injectable()
export class LikeService {
	constructor(
		private readonly accountService: AccountService,
		private readonly likeRepository: LikeRepository
	) {}

	public async toggleLiked(userId: number, dto: ToggleLikeRequestDto) {
		const targetId = BigInt(dto.targetId);
		const userBigInt = BigInt(userId);

		try {
			const existingLike =
				await this.likeRepository.findByTargetIdAndUserId(
					targetId,
					userBigInt
				);

			if (existingLike) {
				await this.removeFromLiked({ id: Number(existingLike.id) });
				return { liked: false };
			}
		} catch (error) {
			console.error(error);
		}

		await this.addToLiked(userId, dto as unknown as CreateLikeRequestDto);
		return { liked: true };
	}

	public async removeFromLiked(dto: DeleteLikeRequestDto) {
		const likeId = BigInt(dto.id);

		await this.findById(likeId);

		const deleted = await this.likeRepository.deleteById(likeId);

		if (!deleted) {
			throw new BadRequestException(
				"Не удалось удалить запись о понравившемся обьекте"
			);
		}

		return true;
	}

	public async addToLiked(userId: number, dto: CreateLikeRequestDto) {
		const targetId = BigInt(dto.targetId);
		const userBigInt = BigInt(userId);
		const createData = {
			userId: userBigInt,
			targetId: targetId,
			targetType: dto.targetType
		};

		await this.accountService.findById(userBigInt);

		if (await this.likeRepository.findByTargetIdAndUserId(targetId, userBigInt)) {
			throw new BadRequestException(
				"Данный обьект и так находится у пользователя в понравившихся"
			);
		}

		const like = await this.likeRepository.create(createData);

		if (!like) {
			throw new BadRequestException(
				"Не удалось создать запись о понравившемся обьекте"
			);
		}

		return true;
	}

	public async findById(id: bigint) {
		const like = await this.likeRepository.findById(id);

		if (!like) {
			throw new NotFoundException(
				"Понравившийся обьект с таким id не была найден"
			);
		}

		return like;
	}

	public async findByUserId(userId: bigint) {
		return this.likeRepository.findByUserId(userId);
	}

	public async findByTargetIdAndUserId(targetId: bigint, userId: bigint) {
		const like = await this.likeRepository.findByTargetIdAndUserId(
			targetId,
			userId
		);

		if (!like) {
			throw new NotFoundException(
				"У данного пользователя нет записи в понравившихся у данного обьекта"
			);
		}

		return like;
	}
}
