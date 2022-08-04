import { IsEnum } from 'class-validator';
import { Role } from 'src/api/role/role.entity';
import { UserRole } from 'src/api/role/role.enum';

export class UpdateUserRoleDto {
  @IsEnum(UserRole, { each: true })
  roles: Role[];
}
