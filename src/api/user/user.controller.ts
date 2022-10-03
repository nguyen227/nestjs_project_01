import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { JwtPayload } from 'src/auth/interfaces';
import { SWAGGER_EXAMPLE } from 'src/shared/common/swagger.example';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import { PaginationDto } from 'src/shared/dto';
import { genResponse } from 'src/utils/successResponse';
import { HasPermissions, HasRoles } from '../../shared/decorators';
import { PERMISSIONS } from '../permission/permission.enum';
import { ROLES } from '../role/role.enum';
import { UpdateEmailDto, UpdatePasswordDto, UpdateProfileDto } from './dto';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
import { UserService } from './user.service';
@HasRoles(ROLES.EMPLOYEE)
@Controller({ path: 'user', version: '1' })
@ApiTags('user')
@ApiBearerAuth()
export class UserControllerV1 {
  constructor(private userService: UserService) {}

  @Get()
  @HasPermissions(PERMISSIONS.READ_ALL_PROFILE)
  @ApiOperation({ summary: 'Get infor of all user' })
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.GETALL_USER_SUCCESS } })
  public async getAllUser(@Query() paginationDto: PaginationDto) {
    const pagiOptions: IPaginationOptions = {
      limit: paginationDto.limit,
      page: paginationDto.page,
      route: '/user',
    };
    const data = this.userService.getAll(pagiOptions);
    return genResponse(HttpStatus.OK, data);
  }

  @Get('/profile')
  @HasPermissions(PERMISSIONS.READ_PROFILE)
  @ApiOperation({ summary: 'View own profile' })
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.GET_OWN_PROFILE_SUCCESS } })
  public async readOwnProfile(@GetUser() user: JwtPayload) {
    const data = await this.userService.readOwnProfile(user.id);
    return genResponse(HttpStatus.OK, data);
  }

  @Put('/profile')
  @HasPermissions(PERMISSIONS.UDPATE_PROFILE)
  @ApiOperation({ summary: 'Update profile' })
  public async udpateProfile(
    @GetUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const data = await this.userService.updateProfile(user.id, updateProfileDto);
    return genResponse(HttpStatus.OK, data);
  }

  @Get('/roles')
  @ApiOperation({ summary: 'View own roles' })
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.GET_OWN_ROLES_SUCCESS } })
  public async getUserRole(@GetUser() user: JwtPayload) {
    const data = await this.userService.getRolesNameByUserId(user.id);
    return genResponse(HttpStatus.OK, data);
  }

  @Get('/permissions')
  @ApiOperation({ summary: 'View own permissions' })
  public async getUserPermissions(@GetUser() user: JwtPayload) {
    const data = await this.userService.getPermissionsNameByUserId(user.id);
    return genResponse(HttpStatus.OK, data);
  }

  @Get('/manage')
  @HasPermissions(PERMISSIONS.READ_PROFILE)
  @ApiOperation({ summary: 'View employees under management' })
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.GET_USER_UNDER_MANAGEMENT } })
  public async getUsersManage(@GetUser() user: JwtPayload) {
    const data = await this.userService.getUsersManageList(user.id);
    return genResponse(HttpStatus.OK, data);
  }

  @Get('/manager')
  @HasPermissions(PERMISSIONS.READ_PROFILE)
  @ApiOperation({ summary: 'View manager' })
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.GET_MANAGER } })
  public async getUserManager(@GetUser() user: JwtPayload) {
    const data = await this.userService.getUserManager(user.id);
    return genResponse(HttpStatus.OK, data);
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
  public uploadAvatar(@GetUser() user: JwtPayload, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateAvatar(user.id, file);
  }

  @Put('/password')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: 'Update user password' })
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.CHANGE_PASSWORD_SUCCESS } })
  async updatePassword(@GetUser() user: JwtPayload, @Body() updatePasswordDto: UpdatePasswordDto) {
    await this.userService.updatePassword(user.id, updatePasswordDto);
    return genResponse(HttpStatus.OK, null);
  }

  @Put('/phone')
  @ApiOperation({ summary: 'Update user phone number' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.CHANGE_PHONENUMBER_SUCCESS } })
  @ApiBadRequestResponse({ schema: { example: SWAGGER_EXAMPLE.BAD_REQUEST_RESPONSE } })
  @ApiConflictResponse({ schema: { example: SWAGGER_EXAMPLE.CONFLICT_RESPONSE } })
  public async updatePhoneNumber(
    @GetUser() user: JwtPayload,
    @Body() updatePhoneNumberDto: UpdatePhoneNumberDto,
  ) {
    const data = await this.userService.updatePhoneNumber(user.id, updatePhoneNumberDto);
    return genResponse(HttpStatus.OK, data);
  }

  @Put('/email')
  @ApiOperation({ summary: 'Update user email' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.CHANGE_EMAIL_SUCCESS } })
  @ApiConflictResponse({ schema: { example: SWAGGER_EXAMPLE.CONFLICT_RESPONSE } })
  public async updateEmail(@GetUser() user: JwtPayload, @Body() updateEmailDto: UpdateEmailDto) {
    const data = await this.userService.updateEmail(user.id, updateEmailDto);
    return genResponse(HttpStatus.OK, data);
  }
}
