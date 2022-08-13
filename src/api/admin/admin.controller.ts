import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasPermissions, HasRoles } from 'src/auth/decorators';
import { MailService } from 'src/mail/mail.service';
import { RolePermission } from '../permission/permission.enum';
import { UpdateRolePermissionDto } from '../role/dto';
import { AddRoleDto } from '../role/dto/add-role.dto';
import { Role } from '../role/role.entity';
import { UserRole } from '../role/role.enum';
import { RoleService } from '../role/role.service';
import { UpdateUserManager } from '../user/dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Controller()
@HasRoles(UserRole.ADMIN)
@ApiTags('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private userService: UserService, private roleService: RoleService) {}

  @Delete('/user/delete:userId')
  @HasPermissions(RolePermission.DELETE_USER)
  @ApiOperation({ summary: 'Delete user account' })
  public removeUserById(@Param('userId') id: number): Promise<User> {
    return this.userService.removeUserById(id);
  }

  @Put('/user/:id/addrole')
  @ApiOperation({ summary: 'Add role to user' })
  public addUserRole(@Param('id') id: number, @Body() addRoleDto: AddRoleDto) {
    return this.userService.addRoleByUserId(id, addRoleDto.role);
  }

  @Put('/user/manage')
  @ApiOperation({ summary: "Update user's manager" })
  public updateUserManage(@Query() updateUserManager: UpdateUserManager): Promise<User> {
    return this.userService.updateUserManage(updateUserManager.userId, updateUserManager.managerId);
  }

  @Get('/organization')
  @ApiOperation({ summary: 'View organization chart' })
  public getUserTree(): Promise<User[]> {
    return this.userService.getUserTree();
  }

  @Get('/role')
  @ApiOperation({ summary: 'View all role in system' })
  public getAllRole(): Promise<Role[]> {
    return this.roleService.getAllRole();
  }

  @Put('/role')
  @ApiOperation({ summary: 'Add permission to role' })
  public addRolePermission(@Query() updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.roleService.addRolePermission(updateRolePermissionDto);
  }

  @Delete('/role')
  @ApiOperation({ summary: 'Remove permission of role' })
  public deletRolePermission(@Query() updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.roleService.deleteRolePermission(updateRolePermissionDto);
  }
}
