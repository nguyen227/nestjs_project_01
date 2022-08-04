import { Controller, Get, Redirect, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('/google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req: any) {
    return this.authService.googleAuth(req.user);
  }
}
