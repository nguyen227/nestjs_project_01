import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/api/user/user.service';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilio: Twilio;

  constructor(private readonly configService: ConfigService, private userService: UserService) {
    const { accountSid, authToken } = configService.get('twilio');

    this.twilio = new Twilio(accountSid, authToken);
  }

  async initPhoneVerification(userId: number) {
    const userFound = await this.userService.getUserById(userId);
    if (userFound.phoneVerify) throw new BadRequestException('Phone number already verified');

    const { serviceSid } = this.configService.get('twilio');

    const result = await this.twilio.verify
      .services(serviceSid)
      .verifications.create({ to: userFound.phone, channel: 'sms' });

    if (result.status !== 'pending') throw new BadRequestException('Something went wrong!');
    return { message: 'Verification-code sent!' };
  }

  async confirmPhoneNumber(userId: number, verificationCode: string) {
    const { serviceSid } = this.configService.get('twilio');

    const userFound = await this.userService.getUserById(userId);

    const result = await this.twilio.verify
      .services(serviceSid)
      .verificationChecks.create({ to: userFound.phone, code: verificationCode });

    if (!result.valid || result.status !== 'approved')
      throw new BadRequestException('Wrong code provided');

    userFound.phoneVerify = true;
    await this.userService.save(userFound);

    return { message: 'Phone number verify successful' };
  }
}
