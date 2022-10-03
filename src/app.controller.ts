import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './api/user/dto';
import { UserService } from './api/user/user.service';
import { AUTH_CONST } from './auth/auth.constant';
import { AuthService } from './auth/auth.service';
import { LoginDto } from './auth/dto';
import { JwtPayload } from './auth/interfaces';
import { GoogleApiService } from './services/googleapis/googleapi.service';
import { SWAGGER_EXAMPLE } from './shared/common/swagger.example';
import { Public } from './shared/decorators';
import { GetUser } from './shared/decorators/getUser.decorator';
import { genResponse } from './utils/successResponse';
@Controller({ version: '1' })
export class AppControllerV1 {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private googleApiService: GoogleApiService,
  ) {}

  @Public()
  @Post('/signup')
  @ApiTags('auth')
  @ApiCreatedResponse({ schema: { example: SWAGGER_EXAMPLE.USER_CREATED } })
  @ApiConflictResponse({ schema: { example: SWAGGER_EXAMPLE.CONFLICT_RESPONSE } })
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('application/x-www-form-urlencoded')
  public async registerUser(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.createUser(createUserDto);
    return genResponse(HttpStatus.CREATED, data, AUTH_CONST.SIGNUP_SUCCESS);
  }

  @Public()
  @Post('/login')
  @ApiTags('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.LOGIN_SUCCESS } })
  @ApiUnauthorizedResponse({ schema: { example: SWAGGER_EXAMPLE.BAD_CREDENTIALS_RESPONSE } })
  @ApiConsumes('application/x-www-form-urlencoded')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return genResponse(HttpStatus.OK, data, AUTH_CONST.LOGIN_SUCCESS);
  }

  @Post('logout')
  @ApiTags('auth')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ schema: { example: SWAGGER_EXAMPLE.UNAUTHORIZED_RESPONSE } })
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.LOGOUT_SUCCESS } })
  @ApiBearerAuth()
  public async logout(@GetUser() user: JwtPayload) {
    const data = await this.authService.logout(user.id);
    return genResponse(HttpStatus.OK, data, AUTH_CONST.LOGOUT_SUCCESS);
  }

  @Public()
  @Get('/test')
  @ApiExcludeEndpoint()
  public async test() {
    const data = (await this.userService.getAll({ limit: 100, page: 1 })).items;
    return this.googleApiService.createSpreadSheet(data);
  }
}
