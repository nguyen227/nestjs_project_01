import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from 'src/api/role/role.entity';
import { ROLES } from 'src/api/role/role.enum';

export class UpdateUserRoleDto {
  @IsEnum(ROLES, { each: true })
  @ApiProperty()
  roles: Role[];
}
