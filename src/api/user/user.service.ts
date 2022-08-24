import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/interfaces';
import { MailService } from '../../mail/mail.service';
import { Role } from '../role/role.entity';
import { ROLES } from '../role/role.enum';
import { RoleService } from '../role/role.service';
import { CreateUserDto, UpdateProfileDto } from './dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private roleService: RoleService,
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const userFound = await this.getUserById(id);
    const userUpdate = Object.assign({ ...userFound }, updateProfileDto);

    return this.userRepo.save(userUpdate);
  }

  async getAll(): Promise<User[]> {
    return this.userRepo.find({});
  }

  async getUserByUsername(username: string): Promise<User> {
    const userFound = await this.userRepo.findOne({ username });
    if (!userFound) throw new NotFoundException(`User ${username} not found`);

    return userFound;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, username, email } = createUserDto;

    const usernameExists = await this.userRepo.findOne({ username });
    if (usernameExists) throw new ConflictException(`User ${username} already exists`);

    const emailExists = await this.userRepo.findOne({ email });
    if (emailExists) throw new ConflictException(`Email ${email} already exists`);

    let userCreate = this.userRepo.create(createUserDto);

    const defaultRoleForNewUser = await this.roleService.findOneByRoleName(ROLES.EMPLOYEE);
    userCreate.roles = [defaultRoleForNewUser];

    userCreate.password = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(this.configService.get('bcrypt_salt')),
    );

    userCreate = await this.userRepo.save(userCreate);

    const jwtPayload: JwtPayload = { id: userCreate.id };
    const emailToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    this.mailService.sendUserConfirmation(userCreate, emailToken);

    delete userCreate.password;
    return userCreate;
  }

  async getPasswordById(id: number): Promise<string> {
    return await this.userRepo.findPasswordById(id);
  }

  async addRoleByUserId(id: number, role: ROLES): Promise<User> {
    const userFound = await this.userRepo.findOne({ id }, { roles: true });
    if (!userFound) throw new NotFoundException(`User ${id} not found`);

    const roleFound = await this.roleService.findOneByRoleName(role);
    if (!roleFound) throw new NotFoundException(`Role ${role} not found`);

    if (userFound.roles.map((role) => role.roleName).includes(role))
      throw new BadRequestException(`${userFound.username} already has role ${role}`);

    userFound.roles.push(roleFound);

    return this.userRepo.save(userFound);
  }

  async removeUserById(id: number): Promise<User> {
    const userFound = await this.userRepo.findOne({ id });
    if (!userFound) throw new NotFoundException(`User ${id} not found`);

    return this.userRepo.remove(userFound);
  }

  async getRolesByUserId(id: number): Promise<Role[]> {
    const roles = await this.userRepo.findRolesById(id);
    return roles;
  }

  async getRolesNameByUserId(id: number): Promise<string[]> {
    const roles = await this.userRepo.findRolesNameById(id);
    return roles;
  }

  async getUserById(id: number): Promise<User> {
    const userFound = await this.userRepo.findOne({ id });
    if (!id || !userFound) throw new NotFoundException(`User ${id} not found`);
    return userFound;
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({ email });
  }

  async getPermissionsNameByUserId(userId: number): Promise<string[]> {
    return this.userRepo.findPermissionsNameById(userId);
  }

  async getUsersManageList(userId: number): Promise<User[]> {
    return this.userRepo.findUsersManageList(userId);
  }

  async getUserManager(userId: number): Promise<User> {
    return this.userRepo.findUserManager(userId);
  }

  async updateUserManager(userId: number, managerId: number): Promise<User> {
    const user = await this.userRepo.findOne({ id: userId });
    const manager = await this.userRepo.findOne({ id: managerId });

    user.manager = manager;
    await this.userRepo.save(user);

    return user;
  }

  async readOwnProfile(authUserId: number): Promise<User> {
    const userFound = await this.userRepo.findOne({ id: authUserId });
    return userFound;
  }

  async getUserTree(): Promise<User[]> {
    return this.userRepo.findUserTree();
  }

  async save(user: User): Promise<User> {
    return this.userRepo.save(user);
  }
}
