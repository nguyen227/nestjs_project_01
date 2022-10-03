import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Form } from 'src/api/form/form.entity';
import { User } from 'src/api/user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const confirmUrl = `http://localhost:3000/api/v1/auth/confirmEmail?token=${token}`;

    const result = await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to NestJS_Demo_App! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.firstName,
        confirmUrl,
      },
    });
    return result;
  }

  async sendNewUserInfo(user: User, password: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to NestJS_Demo_App! Here is your account info',
      template: './newUserInfo',
      context: {
        name: user.firstName,
        username: user.username,
        password,
      },
    });
  }

  async sendNewFormNotification(user: User, form: Form) {
    const viewFormUrl = `http://localhost:3000/form?id=${form.id}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@example.com>',
      subject: `New ${form.type} form has been create! FormID: ${form.id}`,
      template: './newform',
      context: {
        name: user.firstName,
        viewFormUrl,
        type: form.type,
        formId: form.id,
      },
    });
  }
}
