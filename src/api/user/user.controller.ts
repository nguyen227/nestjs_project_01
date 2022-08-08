import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { HasPermissions, HasRoles } from 'src/auth/decorators';
import { Permission } from '../permission/permission.entity';
import { RolePermission } from '../permission/permission.enum';
import { Role } from '../role/role.entity';
import { UserRole } from '../role/role.enum';
import { UpdateUserRoleDto, UpdateProfileDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@HasRoles(UserRole.EMPLOYEE)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HasRoles(UserRole.ADMIN)
  @HasPermissions(RolePermission.UDPATE_PROFILE)
  public getAllUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Put(':id/role')
  @HasRoles(UserRole.ADMIN)
  public updateUserRole(@Param('id') id: number, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userService.updateUserRoleById(id, updateUserRoleDto);
  }

  @Put('/profile')
  @HasRoles(UserRole.EMPLOYEE)
  @HasPermissions(RolePermission.UDPATE_PROFILE)
  public udpateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.userService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Delete('/delete/:id')
  @HasRoles(UserRole.ADMIN)
  @HasPermissions(RolePermission.DELETE_USER)
  public removeUserById(@Param('id') id: number): Promise<User> {
    return this.userService.removeUserById(id);
  }

  @Get('/roles')
  public getUserRole(@Request() req: any): Promise<Role[]> {
    return this.userService.getUserRole(req.user);
  }

  @Get('/permissions')
  public getUserPermissions(@Request() req: any): Promise<Permission[]> {
    return this.userService.getUserPermissions(req.user);
  }

  @Post('/createform')
  @HasRoles(UserRole.ADMIN, UserRole.HR)
  @HasPermissions(RolePermission.CREATE_FORM)
  public createForm(): Promise<any> {
    return null;
  }

  @Get('/manage')
  @HasPermissions(RolePermission.READ_PROFILE)
  public getUsersManage(@Request() req: any): Promise<User[]> {
    return this.userService.getUsersMangageList(req.user.userId);
  }

  @Post('/manage')
  public updateUserManage(@Request() req: any, @Query('userId') userId: number): Promise<User> {
    return this.userService.updateUserManage(req.user.userId, userId);
  }
}
