import { IsEnum } from 'class-validator';
import { RolePermission } from 'src/api/permission/permission.enum';
import { UserRole } from '../role.enum';

export class UpdateRolePermissionDto {
  @IsEnum(UserRole)
  roleName: UserRole;

  @IsEnum(RolePermission)
  permissionName: RolePermission;
}
