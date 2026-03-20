import { SetMetadata } from "@nestjs/common";

import { Roles as RoleEnum } from "@prisma/client";

export const ROLES_KEY = "roles";
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
