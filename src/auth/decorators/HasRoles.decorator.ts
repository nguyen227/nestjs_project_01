import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ROLES } from '../../api/role/role.enum';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';
export const HasRoles = (...roles: ROLES[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
