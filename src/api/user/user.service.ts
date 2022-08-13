import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/interfaces';
import { MailService } from 'src/mail/mail.service';
import { FormService } from '../form/form.service';
import { Role } from '../role/role.entity';
import { UserRole } from '../role/role.enum';
import { RoleService } from '../role/role.service';
import { CreateUserDto, UpdateProfileDto } from './dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private roleService: RoleService,
    @Inject(forwardRef(() => FormService))
    private formService: FormService,
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const userFound = await this.findOneById(id);
    const userUpdate = Object.assign(userFound, updateProfileDto);
    console.log(updateProfileDto, userUpdate);
    return userUpdate.save();
  }

  async findAll(): Promise<User[]> {
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
    await userCreate.reload();

    const jwtPayload: JwtPayload = { userId: userCreate.id };
    const emailToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    this.mailService.sendUserConfirmation(userCreate, emailToken);
    delete userCreate.password;
    return userCreate;
  }

  async findPasswordById(id: number): Promise<User> {
    return await this.userRepo.getPasswordById(id);
  }

  async addRoleByUserId(id: number, role: UserRole): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ id });
    if (!userFound) throw new NotFoundException(`User ${id} not found`);

    const roleFound = await this.roleService.findOneByRoleName(role);
    if (!roleFound) throw new NotFoundException(`Role ${role} not found`);

    const userRoles = await userFound.roles;

    if (userRoles.map((role) => role.roleName).includes(role))
      throw new BadRequestException(`${userFound.username} already has role ${role}`);

    userRoles.push(roleFound);
    userFound.roles = userRoles;
    return userFound.save();
  }

  async removeUserById(id: number): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ id });
    if (!userFound) throw new NotFoundException(`User ${id} not found`);
    return userFound.remove();
  }

  async getRolesByUserId(id: number): Promise<Role[]> {
    const roles = await this.userRepo.findRolesById(id);
    return roles;
  }

  async getRolesNameByUserId(id: number): Promise<string[]> {
    const roles = await this.userRepo.findRolesNameById(id);
    return roles;
  }

  async findOneById(id: number): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ id });
    if (!id || !userFound) throw new NotFoundException(`User ${id} not found`);
    return userFound;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }

  async getPermissionsNameByUserId(userId: number): Promise<string[]> {
    return this.userRepo.findPermissionsNameById(userId);
  }

  async getUsersMangageList(userId: number): Promise<User[]> {
    return this.userRepo.getUsersMangageList(userId);
  }

  async getUserManager(userId: number): Promise<User> {
    return this.userRepo.getUserManager(userId);
  }

  async updateUserManage(userId: number, managerId: number): Promise<User> {
    const authUser = await this.findOneById(userId);
    const userManage = await this.findOneById(managerId);

    userManage.manager = authUser;
    await userManage.save();

    return userManage;
  }

  async readOwnProfile(authUserId: number): Promise<User> {
    const userFound = await this.findOneById(authUserId);
    return userFound;
  }

  async getUserTree(): Promise<User[]> {
    return this.userRepo.getUserTree();
  }
}
