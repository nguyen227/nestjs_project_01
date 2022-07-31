import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository, private configService: ConfigService) {}

  findAll(): Promise<User[]> {
    return this.userRepo.findBy({});
  }

  async findOneByUsername(username: string): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ username });
    if (!userFound) throw new NotFoundException(`User ${username} not found`);

    return userFound;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, username } = createUserDto;

    const userFound = await this.userRepo.findOneBy({ username });

    const userCreate = this.userRepo.create(createUserDto);
    if (userFound) throw new ConflictException(`User ${username} already exists`);

    userCreate.password = bcrypt.hashSync(password, this.configService.get<number>('bcrypt_salt'));

    await userCreate.save();

    delete userCreate.password;
    return userCreate;
  }

  async findPasswordById(id: number): Promise<User> {
    return await this.userRepo.getPasswordById(id);
  }
}
