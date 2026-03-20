import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLES_KEY } from "../decorators/roles.decorator";

import { Roles as RoleEnum } from "@prisma/client";
import { User } from "@prisma/client";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { TelegramUserDto } from "@/src/modules/account/dto/telegram-user.dto";

interface RequestWithTg {
	tgUser?: TelegramUserDto;
	user?: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private prismaService: PrismaService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		);

		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}

		const request = context.switchToHttp().getRequest<RequestWithTg>();
		const tgUser = request.tgUser;

		if (!tgUser?.id) {
			throw new UnauthorizedException("User not found in request");
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: BigInt(tgUser.id) }
		});

		if (!user) {
			throw new UnauthorizedException("User not found in database");
		}

		const hasRole = requiredRoles.includes(user.role);

		if (!hasRole) {
			throw new ForbiddenException(
				"У вас недостаточно прав для выполнения этого действия"
			);
		}

		request.user = user;

		return true;
	}
}
