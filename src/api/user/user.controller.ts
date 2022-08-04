import { Body, Controller, Delete, Get, Param, Put, Request } from '@nestjs/common';
import { HasPermissions, HasRoles } from 'src/auth/decorators';
import { RolePermission } from '../permission/permission.enum';
import { Role } from '../role/role.entity';
import { UserRole } from '../role/role.enum';
import { UpdateUserRoleDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@HasRoles(UserRole.EMPLOYEE)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HasRoles(UserRole.ADMIN)
  @HasPermissions(RolePermission.UDPATE_PROFILE, RolePermission.DELETE_USER)
  public getAllUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Put(':id/role')
  @HasRoles(UserRole.ADMIN)
  public updateUserRole(@Param('id') id: number, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userService.updateUserRoleById(id, updateUserRoleDto);
  }

  @Delete()
  public removeUser(@Request() req: any): Promise<User> {
    return this.userService.removeUser(req);
  }

  @Get('/role')
  public getUserRole(@Request() req: any): Promise<Role[]> {
    return this.userService.getUserRole(req.user);
  }
}
