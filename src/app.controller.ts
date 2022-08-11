import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LoginRes } from './auth/interfaces/LoginRes.interface';
import { LoginDto } from './auth/dto';
import { Public } from './auth/decorators';
import { User } from './api/user/user.entity';
import { UserService } from './api/user/user.service';
import { CreateUserDto } from './api/user/dto';
@Controller()
export class AppController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Public()
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginRes> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('/signup')
  public registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
