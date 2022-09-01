import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/shared/dto';
import { RequestWithUser } from 'src/shared/interfaces';
import { HasPermissions, HasRoles } from '../../shared/decorators';
import { PERMISSIONS } from '../permission/permission.enum';
import { ROLES } from '../role/role.enum';
import { UpdatePasswordDto, UpdateProfileDto } from './dto';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
@HasRoles(ROLES.EMPLOYEE)
@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HasPermissions(PERMISSIONS.READ_ALL_PROFILE)
  @ApiOperation({ summary: 'Get infor of all user' })
  public getAllUser(@Query() paginationDto: PaginationDto): Promise<Pagination<User>> {
    const pagiOptions: IPaginationOptions = {
      limit: paginationDto.limit,
      page: paginationDto.page,
      route: '/user',
    };
    return this.userService.getAll(pagiOptions);
  }

  @Get('/profile')
  @HasPermissions(PERMISSIONS.READ_PROFILE)
  @ApiOperation({ summary: 'View own profile' })
  public readOwnProfile(@Request() req: RequestWithUser): Promise<User> {
    return this.userService.readOwnProfile(req.user.id);
  }

  @Put('/profile')
  @HasPermissions(PERMISSIONS.UDPATE_PROFILE)
  @ApiOperation({ summary: 'Update profile' })
  public udpateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.userService.updateProfile(req.user.id, updateProfileDto);
  }

  @Get('/roles')
  @ApiOperation({ summary: 'View own roles' })
  public getUserRole(@Request() req: RequestWithUser): Promise<string[]> {
    return this.userService.getRolesNameByUserId(req.user.id);
  }

  @Get('/permissions')
  @ApiOperation({ summary: 'View own permissions' })
  public getUserPermissions(@Request() req: RequestWithUser): Promise<string[]> {
    return this.userService.getPermissionsNameByUserId(req.user.id);
  }

  @Get('/manage')
  @HasPermissions(PERMISSIONS.READ_PROFILE)
  @ApiOperation({ summary: 'View employees under management' })
  public getUsersManage(@Request() req: RequestWithUser): Promise<User[]> {
    return this.userService.getUsersManageList(req.user.id);
  }

  @Put('/avatar')
  @HasPermissions(PERMISSIONS.UDPATE_PROFILE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public uploadAvatar(@Request() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateAvatar(req.user.id, file);
  }

  @Put('/password')
  @ApiOperation({ summary: 'Update user password' })
  public updatePassword(
    @Request() req: RequestWithUser,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(req.user.id, updatePasswordDto);
  }

  @Put('/update-phone')
  @ApiOperation({ summary: 'Update user phone number' })
  public updatePhoneNumber(
    @Request() req: RequestWithUser,
    @Body() updatePhoneNumberDto: UpdatePhoneNumberDto,
  ) {
    return this.userService.updatePhoneNumber(req.user.id, updatePhoneNumberDto);
  }
}
