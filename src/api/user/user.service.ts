import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RoleService } from '../role/role.service';
import { UserRole } from '../role/role.enum';
import { Role } from '../role/role.entity';
import { JwtPayload } from 'src/auth/interfaces';
import { UpdateProfileDto, CreateUserDto, UpdateUserRoleDto } from './dto/user.dto';
import { Permission } from '../permission/permission.entity';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private roleService: RoleService,
    private configService: ConfigService,
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
    userCreate.roles = Promise.resolve([defaultRoleForNewUser]);
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

    userFound.roles = Promise.resolve(roles);
    return userFound.save();
  }

  async removeUserById(id: number): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ id });
    return userFound.remove();
  }

  async getUserRole(jwtPayload: JwtPayload): Promise<Role[]> {
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

  async getUserPermissions({ userId }: JwtPayload): Promise<Permission[]> {
    const userFound = await this.userRepo.findOneBy({ id: userId });

    const userRoles = await userFound.roles;

    const rolesPermissions: Permission[] = [];
    for await (const role of userRoles) {
      const permissions = await role.permissions;
      rolesPermissions.push(...permissions);
    }
    const userPermissions = [...new Set(rolesPermissions.map((permission) => permission.name))];
    console.log(userPermissions);
    return null;
  }

  async getUsersMangageList(userId: number): Promise<User[]> {
    return this.userRepo.getUsersMangageList(userId);
  }

  async getUserManager(userId: number): Promise<User> {
    return this.userRepo.getUserManager(userId);
  }

  async updateUserManage(authUserId: number, userId: number): Promise<User> {
    const authUser = await this.findOneById(authUserId);
    const userManage = await this.findOneById(userId);

    userManage.manager = authUser;
    await userManage.save();

    return userManage;
  }
}
