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
import { File } from 'src/services/files/file.entity';
import { FileService } from 'src/services/files/file.service';
import { MailService } from 'src/services/mail/mail.service';
import { Role } from '../role/role.entity';
import { ROLES } from '../role/role.enum';
import { RoleService } from '../role/role.service';
import { CreateUserDto, UpdatePasswordDto, UpdateProfileDto } from './dto';
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
  ) {}

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const userFound = await this.getUserById(id);
    const userUpdate = Object.assign({ ...userFound }, updateProfileDto);

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
    const userFound = await this.userRepo.findOne({ id: authUserId }, { avatar: true });
    return userFound;
  }

  async getUserTree(): Promise<User[]> {
    return this.userRepo.findUserTree();
  }

  async save(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async updateAvatar(userId: number, file: Express.Multer.File): Promise<File> {
    const { buffer, originalname, mimetype } = file;
    const userFound = await this.userRepo.findOne({ id: userId }, { avatar: true });

    const avatar = await this.fileService.uploadFile(buffer, originalname, mimetype);

    await this.userRepo.update(userId, {
      ...userFound,
      avatar,
    });

    if (userFound.avatar != null) await this.fileService.deleteFile(userFound.avatar.id);

    return avatar;
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const userFound = await this.userRepo.findOne({ id });

    const { oldPassword, newPassword } = updatePasswordDto;
    const userPassword = await this.userRepo.findPasswordById(id);

    const isMatch = bcrypt.compareSync(oldPassword, userPassword);

    if (!isMatch) throw new BadRequestException('Old password is incorrect');

    userFound.password = bcrypt.hashSync(
      newPassword,
      bcrypt.genSaltSync(this.configService.get('bcrypt_salt')),
    );

    return this.userRepo.save(userFound);
  }

  async updatePhoneNumber(id: number, updatePhoneNumberDto: UpdatePhoneNumberDto) {
    const userFound = await this.userRepo.findOne({ id });

    userFound.phone = updatePhoneNumberDto.phoneNumber;

    return this.userRepo.save(userFound);
  }
}
