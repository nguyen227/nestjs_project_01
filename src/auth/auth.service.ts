import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { LoginDto } from './dto';
import { LoginRes } from './interfaces/LoginRes.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';

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
    const userValid = await this.validateUser(loginDto);

    if (!userValid) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { username: userValid.username, sub: userValid.id };

    const loginRes: LoginRes = {
      accessToken: this.jwtService.sign(payload),
      accessTokenExpireIn: process.env.JWT_EXPIRES_IN,
    };

    return loginRes;
  }
}
