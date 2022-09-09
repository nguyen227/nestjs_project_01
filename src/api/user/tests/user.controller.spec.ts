import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProfileDto } from '../dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    getAll: jest.fn().mockResolvedValue([{ data: 'something1' }, { data: 'something2' }]),
    readOwnProfile: jest.fn().mockImplementation(async (id: number) => {
      return { id, userdata: 'something' };
    }),
    updateProfile: jest.fn().mockImplementation(async (id: number, dto: UpdateProfileDto) => {
      return {
        id,
        ...dto,
      };
    }),
    getRolesNameByUserId: jest.fn().mockResolvedValue(['role1', 'role2', 'role3']),
    getPermissionsNameByUserId: jest
      .fn()
      .mockResolvedValue(['permission1', 'permission2', 'permission3']),
    getUsersManageList: jest.fn().mockResolvedValue(['user1', 'user2', 'user3']),
  };

  const req = { user: { id: 1 } }; // add jwtPayLoad to req

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('should return profile of user', async () => {
    const expectedResult = { id: expect.any(Number), userdata: 'something' };
    expect(await controller.readOwnProfile(req)).toEqual(expectedResult);
  });

  test('should return profile of user after update', async () => {
    const updateProfileDto: UpdateProfileDto = {
      address: 'Trong Quan',
      email: 'Hihi',
      idCardNumber: '0123456798',
      name: { first: 'Vu', last: 'Nguyen' },
      phone: '0375233198',
      socialInsuranceCode: '231546218',
      username: 'nguyendz',
    };
    const expectedResult = { id: 1, ...updateProfileDto };
    expect(await controller.udpateProfile(req, updateProfileDto)).toEqual(expectedResult);
  });

  test("should return user's roles", async () => {
    const expectedResult = ['role1', 'role2', 'role3'];
    expect(await controller.getUserRole(req)).toEqual(expectedResult);
  });

  test("should return user's permissions", async () => {
    const expectedResult = ['permission1', 'permission2', 'permission3'];
    expect(await controller.getUserPermissions(req)).toEqual(expectedResult);
  });

  test('should return employees that under management', async () => {
    const expectedResult = ['user1', 'user2', 'user3'];
    expect(await controller.getUsersManage(req)).toEqual(expectedResult);
  });
});
