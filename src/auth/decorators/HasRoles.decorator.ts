import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '../../api/role/role.enum';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';
export const HasRoles = (...roles: UserRole[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
