import { IsEnum } from 'class-validator';
import { ROLES } from '../role.enum';

export class AddRoleDto {
  @IsEnum(ROLES)
  role: ROLES;
}
