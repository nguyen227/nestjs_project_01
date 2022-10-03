import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';

@Controller({ path: 'role', version: '1' })
@ApiTags('role')
@ApiBearerAuth()
export class RoleControllerV1 {
  constructor(private roleService: RoleService) {}
}
