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
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const userFound = await this.userService.findOneByUsername(username);
    if (!userFound) return null;

    const hashPassword = (await this.userService.findPasswordById(userFound.id)).password;
    const equalPassword = bcrypt.compareSync(password, hashPassword);
    if (!equalPassword) return null;

    return userFound;
  }

  async login(loginDto: LoginDto) {
    const userValid: User = await this.validateUser(loginDto);

    if (!userValid) {
      throw new BadRequestException();
    }

    const payload: JwtPayload = { userId: userValid.id };

    const loginRes: LoginRes = {
      userId: userValid.id,
      accessToken: this.jwtService.sign(payload),
      accessTokenExpireIn: process.env.JWT_EXPIRES_IN,
    };

    return loginRes;
  }

  async googleAuth(googleUser: GoogleUser) {
    const { email, name, avatar } = googleUser;

    const userFound = await this.userService.findOneByEmail(email);

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

    const payload: JwtPayload = { userId: userFound.id };

    const loginRes: LoginRes = {
      userId: userFound.id,
      accessToken: this.jwtService.sign(payload),
      accessTokenExpireIn: process.env.JWT_EXPIRES_IN,
    };

    return loginRes;
  }
}
