import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Form } from 'src/api/form/form.entity';
import { User } from 'src/api/user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const confirmUrl = `http://localhost:3000/auth/confirmEmail?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to NestJS_Demo_App! Confirm your Email',
      template: './confirmation',
      context: {
        name: user.name.first,
        confirmUrl,
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
        name: user.name.first,
        viewFormUrl,
        type: form.type,
        formId: form.id,
      },
    });
  }
}
