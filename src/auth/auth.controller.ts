import { Controller, Get, HttpStatus, Query, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SWAGGER_EXAMPLE } from 'src/shared/common/swagger.example';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import { genResponse } from 'src/utils/successResponse';
import { Public } from '../shared/decorators';
import { AUTH_CONST } from './auth.constant';
import { AuthService } from './auth.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtRefeshAuthGuard } from './guards/jwt-refresh.guard';
import { JwtPayload } from './interfaces';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthControllerV1 {
  constructor(private authService: AuthService) {}

  @Get('/google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiProperty({ description: 'Auth with Google' })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('/google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  async googleAuthCallback(@Request() req: any) {
    const data = await this.authService.googleAuth(req.user);
    return genResponse(HttpStatus.OK, data, 'Google auth successful!');
  }

  @Get('/sendEmailVerification')
  @ApiBearerAuth()
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.SENT_CONFIRM_EMAIL } })
  @ApiBadRequestResponse({ schema: { example: SWAGGER_EXAMPLE.BAD_REQUEST_RESPONSE } })
  async sendEmailVerification(@GetUser() user: JwtPayload) {
    const data = await this.authService.sendEmailVerification(user.id);
    return genResponse(HttpStatus.OK, data, AUTH_CONST.SEND_CONFIRM_EMAIL_SUCCESS);
  }

  @Get('/confirmEmail')
  @Public()
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.CONFIRM_EMAIL_SUCCESS } })
  @ApiBadRequestResponse({ schema: { example: SWAGGER_EXAMPLE.BAD_REQUEST_RESPONSE } })
  async confirmEmail(@Query() confirmEmailDto: ConfirmEmailDto) {
    const data = await this.authService.confirmEmail(confirmEmailDto);
    return genResponse(HttpStatus.OK, data, AUTH_CONST.CONFIRM_EMAIL_SUCCESS);
  }

  @Get('/refresh_token')
  @Public()
  @UseGuards(JwtRefeshAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ schema: { example: SWAGGER_EXAMPLE.UNAUTHORIZED_RESPONSE } })
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.REFRESH_TOKEN } })
  async refreshToken(@Request() req: any) {
    const data = await this.authService.refreshTokens(req.user.id, req.user.refreshToken);
    return genResponse(HttpStatus.OK, data, AUTH_CONST.REFRESH_TOKEN_SUCCESS);
  }
}
