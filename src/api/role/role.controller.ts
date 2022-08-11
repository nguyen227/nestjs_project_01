import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('role')
@ApiBearerAuth()
export class RoleController {
  constructor(private roleService: RoleService) {}
}
