import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasPermissions, HasRoles } from 'src/auth/decorators';
import { RolePermission } from '../permission/permission.enum';
import { AddRoleDto } from '../role/dto/add-role.dto';
import { UserRole } from '../role/role.enum';
import { UpdateUserManager } from '../user/dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Controller()
@HasRoles(UserRole.ADMIN)
@ApiTags('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private userService: UserService) {}

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
}
