import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as genpass from 'generate-password';
import { CreateUserDto } from 'src/api/user/dto';
import { User } from 'src/api/user/user.entity';
import { UserService } from 'src/api/user/user.service';
import { MailService } from 'src/services/mail/mail.service';
import { ERROR } from 'src/shared/common/error.constant';
import { LoginDto } from './dto';
import { ConfirmEmailDto } from './dto/';
import { GoogleUser, JwtPayload } from './interfaces';
import { LoginRes } from './interfaces/LoginRes.interface';
import { Tokens } from './types/tokens.type';
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
      throw new UnauthorizedException(ERROR.AUTH.BAD_CREADENTIALS.MESSAGE);
    }

    const tokens = await this.getTokens(userValid.id);
    userValid.refreshToken = await this.hashData(tokens.refreshToken);
    this.userService.save(userValid);
    return tokens;
  }

  async googleAuth(googleUser: GoogleUser) {
    const { email, name, accessToken } = googleUser;

    const userFound = await this.userService.getUserByEmail(email);

    if (!userFound) {
      const createUserDto: CreateUserDto = {
        email,
        firstName: name.familyName,
        lastName: name.givenName,
        username: email,
        password: genpass.generate({ length: 10, numbers: true }),
      };
      return this.userService.createUser(createUserDto);
    }

    const payload: JwtPayload = { id: userFound.id };

    const loginRes: LoginRes = {
      accessToken: this.jwtService.sign(payload, { secret: this.configService.get('JWT_SECRET') }),
      accessTokenExpireIn: process.env.JWT_EXPIRES_IN,
    };

    return { googleUser, ...loginRes, googleAccessToken: accessToken };
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
    const { token } = confirmEmailDto;

    const decodeToken: JwtPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const { id } = decodeToken;

    const userFound = await this.userService.getUserById(id);

    if (userFound.emailVerify) throw new BadRequestException(ERROR.USER.EMAIL_VERIFIED);
    userFound.emailVerify = true;
    const userSave = await this.userService.save(userFound);
    return {
      id: userSave.id,
      username: userSave.username,
      email: userSave.email,
      emailVerify: userSave.emailVerify,
    };
  }

  async sendEmailVerification(userId: number) {
    const userFound = await this.userService.getUserById(userId);

    const jwtPayload: JwtPayload = { id: userFound.id };
    const emailToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    if (userFound.emailVerify) throw new BadRequestException(ERROR.USER.EMAIL_VERIFIED.MESSAGE);
    this.mailService.sendUserConfirmation(userFound, emailToken);
    return null;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const userRefreshTokenFound = await this.userService.getRefreshTokenById(userId);
    const isRefreshTokenMatch = await bcrypt.compare(refreshToken, userRefreshTokenFound);
    if (!isRefreshTokenMatch) throw new ForbiddenException(`Access denined!`);

    const tokens = await this.getTokens(userId);
    delete tokens.refreshToken;
    delete tokens.refreshToken_ExpireIn;
    return tokens;
  }

  async getTokens(userId: number): Promise<Tokens> {
    const payload = { id: userId };

    const accessToken_ExpireIn = this.configService.get('JWT_EXPIRES_IN');
    const refreshToken_ExpireIn = this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN');

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: accessToken_ExpireIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: refreshToken_ExpireIn,
    });
    return { accessToken, accessToken_ExpireIn, refreshToken, refreshToken_ExpireIn };
  }

  async logout(userId: number) {
    await this.updateHashRefreshToken(userId, null);
    const userFound = await this.userService.getUserById(userId);

    return { id: userFound.id, username: userFound.username };
  }

  async updateHashRefreshToken(userId: number, refreshToken: string) {
    const hashRefeshToken = await this.hashData(refreshToken);
    await this.userService.updateHashRefreshToken(userId, hashRefeshToken);
  }

  async hashData(data: string) {
    if (data === null) return null;
    return bcrypt.hash(data, 10);
  }
}
