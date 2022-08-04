import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserRoleDto } from './dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RoleService } from '../role/role.service';
import { UserRole } from '../role/role.enum';
import { Role } from '../role/role.entity';
import { JwtPayload } from 'src/auth/interfaces';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private roleService: RoleService,
    private configService: ConfigService,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepo.findBy({});
  }

  async findOneByUsername(username: string): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ username });
    if (!userFound) throw new NotFoundException(`User ${username} not found`);

    return userFound;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, username, email } = createUserDto;

    const usernameExists = await this.userRepo.findOneBy({ username });
    if (usernameExists) throw new ConflictException(`User ${username} already exists`);

    const emailExists = await this.userRepo.findOneBy({ email });
    if (emailExists) throw new ConflictException(`Email ${email} already exists`);

    const userCreate = this.userRepo.create(createUserDto);

    const defaultRoleForNewUser = await this.roleService.findOneByRoleName(UserRole.EMPLOYEE);
    userCreate.roles = [defaultRoleForNewUser];
    userCreate.password = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(this.configService.get('bcrypt_salt')),
    );

    await userCreate.save();

    delete userCreate.password;
    return userCreate;
  }

  async findPasswordById(id: number): Promise<User> {
    return await this.userRepo.getPasswordById(id);
  }

  async updateUserRoleById(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<User> {
    const { roles } = updateUserRoleDto;

    const userFound = await this.userRepo.findOneBy({ id });
    if (!userFound) throw new NotFoundException(`User ${id} not found`);

    userFound.roles = roles;
    return userFound.save();
  }

  async removeUser(req: any): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ id: req.user.id });
    return userFound.remove();
  }

  async getUserRole(jwtPayload: JwtPayload): Promise<Role[]> {
    console.log(jwtPayload);
    const userFound = await this.userRepo.findOneBy({ id: jwtPayload.userId });
    return userFound.roles;
  }

  async findOneById(id: number): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ id });
    if (!userFound) throw new NotFoundException(`User ${id} not found`);
    return userFound;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }
}
