import { IsEnum } from 'class-validator';
import { UserRole } from '../role.enum';

export class AddRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
