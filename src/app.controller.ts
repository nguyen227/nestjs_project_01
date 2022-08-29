import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LoginRes } from './auth/interfaces/LoginRes.interface';
import { LoginDto } from './auth/dto';
import { Public } from './shared/decorators';
import { User } from './api/user/user.entity';
import { UserService } from './api/user/user.service';
import { CreateUserDto } from './api/user/dto';
import { ApiTags } from '@nestjs/swagger';
@Controller()
export class AppController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Public()
  @Post('/login')
  @ApiTags('auth')
  async login(@Body() loginDto: LoginDto): Promise<LoginRes> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('/signup')
  @ApiTags('auth')
  public registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
