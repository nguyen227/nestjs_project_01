import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefeshAuthGuard extends AuthGuard('jwt-refresh') {}
