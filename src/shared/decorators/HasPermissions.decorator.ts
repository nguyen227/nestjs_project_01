import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from 'src/api/permission/permission.enum';
import { PermissionGuard } from '../../auth/guards/permissions.guard';

export const PERMISSIONS_KEY = 'permissions';
export const HasPermissions = (...permissions: PERMISSIONS[]) =>
  applyDecorators(SetMetadata(PERMISSIONS_KEY, permissions), UseGuards(PermissionGuard));
