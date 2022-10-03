import { Module } from '@nestjs/common';
import { GoogleApiService } from './googleapi.service';

@Module({ providers: [GoogleApiService], exports: [GoogleApiService] })
export class GoogleApiModule {}
