import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { ROLES } from 'src/api/role/role.enum';
import { RoleService } from 'src/api/role/role.service';
import { CreateUserDto, UpdateProfileDto } from '../dto';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';

const moduleMocker = new ModuleMocker(global);

const [user1, user2] = [
  { id: 1, username: 'testuser1' },
  { id: 2, username: 'testuser2' },
];

const [role1, role2] = [
  { id: 1, roleName: 'employee' },
  { id: 2, roleName: 'hr' },
];

const mockUserRepository = {
  findOne: jest.fn().mockResolvedValue(user1),
  find: jest.fn().mockResolvedValue([user1, user2]),
  save: jest.fn().mockResolvedValue(user1),
  create: jest.fn().mockReturnValue(user1),
  findPasswordById: jest.fn().mockResolvedValue('test_password'),
  remove: jest.fn().mockResolvedValue(user1),
  findRolesById: jest.fn().mockResolvedValue([role1, role2]),
  findRolesNameById: jest.fn().mockResolvedValue(['employee', 'hr']),
  findPermissionsNameById: jest.fn().mockResolvedValue(['read_profile', 'update_profile']),
  findUsersManageList: jest.fn().mockResolvedValue([user1, user2]),
  findUserManager: jest.fn().mockResolvedValue(user1),
  findUserTree: jest.fn().mockResolvedValue({}),
};

const mockRoleService = {
  findOneByRoleName: jest.fn().mockResolvedValue(role1),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        switch (token) {
          case UserRepository:
            return mockUserRepository;
          case RoleService:
            return mockRoleService;
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<UserService>(UserService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('-function updateProfile()', () => {
    test('should return user info after update', async () => {
      const updateProfileDto: UpdateProfileDto = {
        address: 'Trong Quan',
        email: 'Hihi',
        idCardNumber: '0123456798',
        name: { first: 'Vu', last: 'Nguyen' },
        phone: '0375233198',
        socialInsuranceCode: '231546218',
        username: 'nguyendz',
      };
      const expectedResult = user1;
      expect(await service.updateProfile(1, updateProfileDto)).toEqual(expectedResult);
    });
  });

  describe('-function findAll()', () => {
    test('should return all user', async () => {
      const expectedResult = [user1, user2];
      expect(await service.getAll()).toEqual(expectedResult);
    });
  });

  describe('-function getUserByUsername()', () => {
    test('should return user', async () => {
      const expectedResult = user1;
      expect(await service.getUserByUsername('testuser1')).toEqual(expectedResult);
    });

    test('should throw error when username not exist', () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      expect(service.getUserByUsername('dontexist')).rejects.toThrow(NotFoundException);
    });
  });

  describe('-function createUser()', () => {
    const createUserDto: CreateUserDto = {
      email: 'usertest3@gmail.com',
      name: {
        first: 'User',
        last: 'Test',
      },
      password: '123123',
      username: 'testuser01',
    };

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should return user info after create', async () => {
      const user3 = { id: 3, username: 'testuser3' };
      mockUserRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      mockUserRepository.create.mockResolvedValueOnce(user3);
      mockUserRepository.save.mockResolvedValueOnce({ ...user3, roles: [role1] });
      expect(await service.createUser(createUserDto)).toEqual({ ...user3, roles: [role1] });
    });

    test('should throw error if username or email already exist', () => {
      mockUserRepository.findOne.mockResolvedValueOnce(user1);
      expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('-fucntion getPasswordById()', () => {
    test('should return password string', async () => {
      expect(await service.getPasswordById(1)).toEqual(expect.any(String));
    });
  });

  describe('-function addRoleByUserId()', () => {
    test('should add role to user', async () => {
      const user3 = { id: 3, username: 'testuser3', roles: [role1] };
      mockUserRepository.findOne.mockResolvedValueOnce(user3);
      mockRoleService.findOneByRoleName.mockResolvedValueOnce(role2);
      mockUserRepository.save.mockResolvedValueOnce({ ...user3, roles: [role1, role2] });
      expect(await service.addRoleByUserId(3, ROLES.HR)).toEqual({
        ...user3,
        roles: [role1, role2],
      });
    });

    test('should throw error if role not found', () => {
      const user3 = { id: 3, username: 'testuser3', roles: [role1] };
      mockUserRepository.findOne.mockResolvedValueOnce(user3);
      mockRoleService.findOneByRoleName.mockResolvedValueOnce(null);
      expect(service.addRoleByUserId(1, ROLES.HR)).rejects.toThrow(NotFoundException);
    });

    test('should throw error if user already have role', () => {
      const user3 = { id: 3, username: 'testuser3', roles: [role1] };
      mockUserRepository.findOne.mockResolvedValueOnce(user3);
      mockRoleService.findOneByRoleName.mockResolvedValueOnce(role1);
      expect(service.addRoleByUserId(1, ROLES.EMPLOYEE)).rejects.toThrow(BadRequestException);
    });
  });

  describe('-function removeUserById()', () => {
    test('should return deleted user', async () => {
      const expectedResult = user1;
      expect(await service.removeUserById(1)).toEqual(expectedResult);
    });
  });

  describe('-function getRolesByUserId()', () => {
    test('should return list role of user', async () => {
      const expectedResult = [role1, role2];
      expect(await service.getRolesByUserId(1)).toEqual(expectedResult);
    });
  });

  describe('-function getRolesNameByUserId()', () => {
    test('should return list role name of user', async () => {
      const expectedResult = ['employee', 'hr'];
      expect(await service.getRolesNameByUserId(1)).toEqual(expectedResult);
    });
  });

  describe('-function getUserById()', () => {
    test('should return user', async () => {
      const expectedResult = user1;
      expect(await service.getUserById(1)).toEqual(expectedResult);
    });
  });

  describe('-function getUserByEmail()', () => {
    test('should return user', async () => {
      const expectedResult = user1;
      expect(await service.getUserByEmail('test@gmail.com')).toEqual(expectedResult);
    });
  });

  describe('-function getPermissionsNameByUserId()', () => {
    test('should return list name of permissions', async () => {
      const expectedResult = ['read_profile', 'update_profile'];
      expect(await service.getPermissionsNameByUserId(1)).toEqual(expectedResult);
    });
  });

  describe('-function getUsersManageList()', () => {
    test('should return list user that under management', async () => {
      const expectedResult = [user1, user2];
      expect(await service.getUsersManageList(3)).toEqual(expectedResult);
    });
  });

  describe('-function getUserManager()', () => {
    test('should return manager', async () => {
      const expectedResult = user1;
      expect(await service.getUserManager(2)).toEqual(expectedResult);
    });
  });

  describe('-function updateUserManager()', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should return user after update', async () => {
      const user3 = { id: 1, username: 'testuser3' };
      mockUserRepository.findOne.mockResolvedValueOnce(user3).mockResolvedValueOnce(user1);

      const expectedResult = user3;
      expect(await service.updateUserManager(1, 2)).toEqual(expectedResult);
    });
  });

  describe('-function readOwnProfile()', () => {
    test('should return user profile', async () => {
      const expectedResult = user1;
      expect(await service.readOwnProfile(1)).toEqual(expectedResult);
    });
  });

  describe('-function getUserTree()', () => {
    test('should return organize of system', async () => {
      const expectedResult = {};
      expect(await service.getUserTree()).toEqual(expectedResult);
    });
  });

  describe('-function save()', () => {
    test('should return saved user to db', async () => {
      const expectedResult = user1;
      expect(await service.save(new User())).toEqual(expectedResult);
    });
  });
});
