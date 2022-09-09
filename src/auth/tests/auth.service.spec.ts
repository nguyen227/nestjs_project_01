import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/api/user/user.service';
import { MailService } from 'src/services/mail/mail.service';
import { mockJwtService } from 'src/utils/mocks/mockJwtService';
import { mockMailService } from 'src/utils/mocks/mockMailService';
import { mockConfigService } from '../../utils/mocks/mockConfigService';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto';
import { ConfirmEmailDto } from '../dto/confirm-email.dto';

jest.mock('bcrypt');

let mockUserService = {
  getUserByUsername: jest.fn().mockResolvedValue({ id: 1, name: 'usertest01' }),
  getPasswordById: jest.fn().mockResolvedValue('hihi'),
  getUserById: jest.fn().mockResolvedValue({ id: 1, emailVerify: false }),
  save: jest.fn().mockResolvedValue({}),
};

describe('AuthService', () => {
  let authService: AuthService;
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    mockUserService = {
      getUserByUsername: jest.fn().mockResolvedValue({ id: 1, name: 'usertest01' }),
      getPasswordById: jest.fn().mockResolvedValue('hihi'),
      getUserById: jest.fn().mockResolvedValue({ id: 1, emailVerify: false }),
      save: jest.fn().mockResolvedValue({}),
    };

    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compareSync as jest.Mock) = bcryptCompare;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('-fucntion validateUser()', () => {
    const loginDto: LoginDto = { username: 'test01', password: '123123' };
    beforeEach(() => {
      mockUserService.getUserByUsername = jest
        .fn()
        .mockResolvedValue({ id: 1, name: 'usertest01' });
    });

    test('should return user if user exist', async () => {
      const expectedResult = { id: 1, name: 'usertest01' };
      expect(await authService.validateUser(loginDto)).toEqual(expectedResult);
    });

    test("should return null if user don't exist", async () => {
      mockUserService.getUserByUsername = jest.fn().mockResolvedValue(null);
      const expectedResult = null;
      expect(await authService.validateUser(loginDto)).toEqual(expectedResult);
    });
  });

  describe('-function login()', () => {
    const loginDto: LoginDto = { username: 'test01', password: '123123' };

    test('should return access info', async () => {
      const expectedResult = { accessToken: 'test_token', accessTokenExpireIn: '10h' };
      expect(await authService.login(loginDto)).toEqual(expectedResult);
    });

    test('should throw error if wrong username', async () => {
      mockUserService.getUserByUsername = jest.fn().mockResolvedValue(null);
      expect(authService.login(loginDto)).rejects.toThrow(BadRequestException);
    });

    test('should throw error if wrong password', async () => {
      bcryptCompare = jest.fn().mockReturnValue(false);
      (bcrypt.compareSync as jest.Mock) = bcryptCompare;
      expect(authService.login(loginDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('-function confirmEmail()', () => {
    test('should return user with properties "emailVerify" was set to "true"', async () => {
      const confirmMailDto: ConfirmEmailDto = { token: 'test_token' };
      const expectedResult = { id: 1, emailVerify: true };

      expect(await authService.confirmEmail(confirmMailDto)).toEqual(expectedResult);
    });
  });
});
