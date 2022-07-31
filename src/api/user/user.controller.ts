import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public getAllUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:username')
  public getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.userService.findOneByUsername(username);
  }

  @Post()
  public registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
