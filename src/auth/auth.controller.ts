import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../shared/decorators';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RequestWithUser } from 'src/shared/interfaces';

@Controller('auth')
@ApiTags('auth')
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

  @Get('/confirmEmail')
  @Public()
  async confirmEmail(@Query() confirmEmailDto: ConfirmEmailDto) {
    return this.authService.confirmEmail(confirmEmailDto);
  }

  @Get('/sendEmailVerification')
  @ApiBearerAuth()
  async sendEmailVerification(@Request() req: RequestWithUser) {
    return this.authService.sendEmailVerification(req.user.id);
  }
}
