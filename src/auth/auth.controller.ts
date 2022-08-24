import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Get('/google')
  // @Public()
  // @UseGuards(GoogleAuthGuard)
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // async googleAuth() {}

  // @Get('/google/callback')
  // @Public()
  // @UseGuards(GoogleAuthGuard)
  // async googleAuthCallback(@Request() req: any) {
  //   return this.authService.googleAuth(req.user);
  // }

  @Get('/confirmEmail')
  @Public()
  async confirmEmail(@Query() confirmEmailDto: ConfirmEmailDto) {
    return this.authService.confirmEmail(confirmEmailDto);
  }
}
