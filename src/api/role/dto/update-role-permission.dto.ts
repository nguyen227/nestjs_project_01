import { IsEnum } from 'class-validator';
import { PERMISSIONS } from 'src/api/permission/permission.enum';
import { ROLES } from '../role.enum';

export class UpdateRolePermissionDto {
  @IsEnum(ROLES)
  roleName: ROLES;

  @IsEnum(PERMISSIONS)
  permissionName: PERMISSIONS;
}
