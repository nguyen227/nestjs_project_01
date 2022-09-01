import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SmsService } from './sms.service';

@Controller('sms')
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('/sendVerifyCode')
  @ApiBearerAuth()
  async initVerification(@Request() req: any) {
    return this.smsService.initPhoneVerification(req.user.id);
  }

  @Post('/verify')
  @ApiBearerAuth()
  async verify(@Request() req: any, @Query('code') code: string) {
    return this.smsService.confirmPhoneNumber(req.user.id, code);
  }
}
