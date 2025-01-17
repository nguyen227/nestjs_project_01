import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './api/admin/admin.module';
import { FormModule } from './api/form/form.module';
import { PermissionModule } from './api/permission/permission.module';
import { UserModule } from './api/user/user.module';
import { AppControllerV1 } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import configuration from './configs/configuration';
import { GoogleApiModule } from './services/googleapis/googleapi.module';
import { MailModule } from './services/mail/mail.module';
import { SmsModule } from './services/sms/sms.module';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', load: [configuration], isGlobal: true }),
    UserModule,
    AuthModule,
    FormModule,
    AdminModule,
    MailModule,
    SmsModule,
    PermissionModule,
    GoogleApiModule,
  ],
  controllers: [AppControllerV1],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
