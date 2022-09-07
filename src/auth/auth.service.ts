import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as genpass from 'generate-password';
import { CreateUserDto } from 'src/api/user/dto';
import { User } from 'src/api/user/user.entity';
import { UserService } from 'src/api/user/user.service';
import { MailService } from 'src/services/mail/mail.service';
import { LoginDto } from './dto';
import { ConfirmEmailDto } from './dto/';
import { GoogleUser, JwtPayload } from './interfaces';
import { LoginRes } from './interfaces/LoginRes.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const userFound = await this.userService.getUserByUsername(username);
    if (!userFound) return null;

    const hashPassword = await this.userService.getPasswordById(userFound.id);
    const equalPassword = bcrypt.compareSync(password, hashPassword);
    if (!equalPassword) return null;

    return userFound;
  }

  async login(loginDto: LoginDto) {
    const userValid: User = await this.validateUser(loginDto);

    if (!userValid) {
      throw new BadRequestException();
    }

    const payload: JwtPayload = { id: userValid.id };

    const loginRes: LoginRes = {
      accessToken: this.jwtService.sign(payload),
      accessTokenExpireIn: this.configService.get('jwt_config').expiresIn,
    };

    return loginRes;
  }

  async googleAuth(googleUser: GoogleUser) {
    const { email, name } = googleUser;

    const userFound = await this.userService.getUserByEmail(email);

    if (!userFound) {
      const createUserDto: CreateUserDto = {
        email,
        name: {
          first: name.familyName,
          last: name.givenName,
        },
        username: email,
        password: genpass.generate({ length: 10, numbers: true }),
      };
      return this.userService.createUser(createUserDto);
    }

    const payload: JwtPayload = { id: userFound.id };

    const loginRes: LoginRes = {
      accessToken: this.jwtService.sign(payload),
      accessTokenExpireIn: process.env.JWT_EXPIRES_IN,
    };

    return loginRes;
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
    const { token } = confirmEmailDto;

    const decodeToken: JwtPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const { id } = decodeToken;

    const userFound = await this.userService.getUserById(id);
    userFound.emailVerify = true;
    await this.userService.save(userFound);
    return userFound;
  }

  async sendEmailVerification(userId: number) {
    const userFound = await this.userService.getUserById(userId);

    const jwtPayload: JwtPayload = { id: userFound.id };
    const emailToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    if (userFound.emailVerify) throw new BadRequestException('Email already verified!');
    this.mailService.sendUserConfirmation(userFound, emailToken);

    return { message: 'Send verification email successful!' };
  }
}
