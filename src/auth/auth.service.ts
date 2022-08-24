import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { LoginDto } from './dto';
import { LoginRes } from './interfaces/LoginRes.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { GoogleUser, JwtPayload } from './interfaces';
import { User } from 'src/api/user/user.entity';
import * as genpass from 'generate-password';
import { CreateUserDto } from 'src/api/user/dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    const { email, name, avatar } = googleUser;

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
        avatar,
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
}
