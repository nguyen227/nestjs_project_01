import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { JwtPayload } from 'src/auth/interfaces';
import { FileService } from 'src/services/files/file.service';
import { MailService } from 'src/services/mail/mail.service';
import { ERROR } from 'src/shared/common/error.constant';
import { PermissionService } from '../permission/permission.service';
import { Role } from '../role/role.entity';
import { ROLES } from '../role/role.enum';
import { RoleService } from '../role/role.service';
import { CreateUserDto, UpdateEmailDto, UpdatePasswordDto, UpdateProfileDto } from './dto';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
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
    private fileService: FileService,
    private permissionService: PermissionService,
  ) {}

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const userFound = await this.getUserById(id);

    const userUpdate = Object.assign({ ...userFound }, { ...updateProfileDto });

    return this.userRepo.save(userUpdate);
  }

  async getAll(pagiOptions: IPaginationOptions): Promise<Pagination<User>> {
    return this.userRepo.findPagination(pagiOptions, {});
  }

  async getUserByUsername(username: string): Promise<User> {
    const userFound = await this.userRepo.findOne({ username });
    if (!userFound) throw new NotFoundException(`User ${username} not found`);

    return userFound;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, username, email, firstName, lastName } = createUserDto;

    const usernameExists = await this.userRepo.findOne({ username });
    if (usernameExists) throw new ConflictException(ERROR.USER.USERNAME_EXISTED.MESSAGE);

    const emailExists = await this.userRepo.findOne({ email });
    if (emailExists) throw new ConflictException(ERROR.USER.EMAIL_EXISTED.MESSAGE);

    const data = {
      username,
      firstName,
      lastName,
      email,
      password,
    };
    let userCreate = this.userRepo.create(data);

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

    this.mailService.sendNewUserInfo(userCreate, password);
    this.mailService.sendUserConfirmation(userCreate, emailToken);

    delete userCreate.password;
    return userCreate;
  }

  async getPasswordById(id: number): Promise<string> {
    return await this.userRepo.findPasswordById(id);
  }

  async getRefreshTokenById(id: number): Promise<string> {
    return await this.userRepo.findRefreshTokenById(id);
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
    const permissionsFound = await this.permissionService.getPermissionsByUserId(userId);
    const listPermissions = permissionsFound.map((permission) => permission.name);
    return listPermissions;
  }

  async getUsersManageList(userId: number) {
    return this.userRepo.findUsersManageList(userId);
  }

  async getUserManager(userId: number) {
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
    const userFound = await this.userRepo.findOne({ id: authUserId }, { avatar: true });
    return userFound;
  }

  async getUserTree(): Promise<User[]> {
    return this.userRepo.findUserTree();
  }

  async save(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async updateAvatar(userId: number, file: Express.Multer.File) {
    const { buffer, originalname, mimetype } = file;
    const userFound = await this.userRepo.findOne({ id: userId }, { avatar: true });
    if (!userFound.avatar) {
      const avatar = await this.fileService.uploadFile(buffer, originalname, mimetype);
      userFound.avatar = avatar;
      this.save(userFound);
      return avatar;
    } else {
      await this.fileService.putFile(userFound.avatar.id, buffer, mimetype);
      return userFound.avatar;
    }
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const userFound = await this.userRepo.findOne({ id });

    const { oldPassword, newPassword } = updatePasswordDto;
    const userPassword = await this.userRepo.findPasswordById(id);

    const isMatch = bcrypt.compareSync(oldPassword, userPassword);

    if (!isMatch) throw new BadRequestException('Old password is incorrect');

    if (newPassword === oldPassword)
      throw new BadRequestException('Must not be same with old password');

    userFound.password = bcrypt.hashSync(
      newPassword,
      bcrypt.genSaltSync(this.configService.get('bcrypt_salt')),
    );

    return this.userRepo.save(userFound);
  }

  async updatePhoneNumber(id: number, updatePhoneNumberDto: UpdatePhoneNumberDto) {
    const { phoneNumber } = updatePhoneNumberDto;
    const userFound = await this.userRepo.findOne({ id });
    if (userFound.phone === phoneNumber) throw new BadRequestException('Already use this number');

    const phoneExisted = await this.userRepo.findOne({ phone: phoneNumber });
    if (phoneExisted) throw new ConflictException('This phone number already existed!');

    userFound.phoneVerify = false;
    userFound.phone = phoneNumber;

    return this.userRepo.save(userFound);
  }

  async updateEmail(id: number, updateMailDto: UpdateEmailDto) {
    const { email } = updateMailDto;
    const userFound = await this.userRepo.findOne({ id });
    const emailExists = await this.userRepo.findOne({ email });
    if (emailExists) throw new ConflictException(ERROR.USER.EMAIL_EXISTED);
    userFound.email = email;
    userFound.emailVerify = false;
    return this.userRepo.save(userFound);
  }

  async updateHashRefreshToken(userId: number, hrt: string) {
    const userFound = await this.userRepo.findOne({ id: userId });
    userFound.refreshToken = hrt;
    return this.userRepo.save(userFound);
  }
}
