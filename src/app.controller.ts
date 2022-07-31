import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LoginRes } from './auth/interfaces/LoginRes.interface';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoginDto } from './auth/dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginRes> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
