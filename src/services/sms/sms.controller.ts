import {
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_EXAMPLE } from 'src/shared/common/swagger.example';
import { genResponse } from 'src/utils/successResponse';
import { SmsService } from './sms.service';

@Controller({ path: 'sms', version: '1' })
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('/sendVerifyCode')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.SENT_PHONE_VERIFY } })
  async initVerification(@Request() req: any) {
    const data = await this.smsService.initPhoneVerification(req.user.id);
    return genResponse(HttpStatus.OK, data, 'Sent verify code successful');
  }

  @Post('/verify')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { example: SWAGGER_EXAMPLE.CONFIRM_PHONE_SUCCESS } })
  @ApiBadRequestResponse({ schema: { example: SWAGGER_EXAMPLE.BAD_REQUEST_RESPONSE } })
  async verify(@Request() req: any, @Query('code') code: string) {
    return this.smsService.confirmPhoneNumber(req.user.id, code);
  }
}
