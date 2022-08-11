import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/configs/database/database.module';
import { UserModule } from '../user/user.module';
import { FormController } from './form.controller';
import { FormProviders } from './form.provider';
import { FormRepository } from './form.repository';
import { FormService } from './form.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule)],
  controllers: [FormController],
  providers: [FormService, FormRepository, ...FormProviders],
  exports: [FormService],
})
export class FormModule {}
