import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import configuration from './configs/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.dev', load: [configuration] }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
