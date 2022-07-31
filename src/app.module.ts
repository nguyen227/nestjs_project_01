import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import configuration from './configs/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.dev', load: [configuration] }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
