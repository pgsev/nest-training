import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/repository/user.entity';
import { AppService } from './app.service';
import { NotFoundException } from '@nestjs/common';

jest.mock('typeorm', () => {
  const originalModule = jest.requireActual('typeorm');
  // 模拟的 Repository 类
  class MockRepository<T> {
    // ... 这里可以添加你需要模拟的方法，例如 find, save 等
    delete = jest.fn().mockResolvedValue({ affected: 1 });
    findOne = jest.fn().mockResolvedValue({
      id: 1,
      username: '张34',
      firstName: 'jame1s',
      lastName: 'harde1n',
      email: 't1est@qq.com',
      password: '123456',
      phone: '15166644745',
      userStatus: 0,
    });
    insert = jest.fn();
    update = jest.fn();
  }

  return {
    ...originalModule,
    getRepository: jest.fn().mockImplementation(() => {
      return new MockRepository<User>();
    }),
  };
});

describe('UserService', () => {
  let userService: AppService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    // 初始化UserService，并获取模拟的Repository实例

    // 由于我们模拟了getRepository，因此需要直接获取该模拟实例

    userRepository = getRepository(User) as Repository<User>;
    userService = new AppService(userRepository);
  });

  afterEach(() => {
    // 在每个测试用例后重置模拟函数的调用和实例
    jest.clearAllMocks();
  });

  describe('deleteUserByUsername', () => {
    test('should delete a user when username exists', async () => {
      const username = 'testUser';
      (userRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
      const result = await userService.deleteUserByUsername(username); // 假设这个方法在UserService中定义
      expect(result).toEqual({ affected: 1 });
      expect(userRepository.delete).toHaveBeenCalledWith({
        username: username,
      });
    });

    test('should not delete any user when the user does not exist', async () => {
      const username = 'nonExistingUser';
      (userRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      const result = await userService.deleteUserByUsername(username);

      expect(result).toEqual({ affected: 0 });
      expect(userRepository.delete).toHaveBeenCalledWith({
        username: username,
      });
    });

    test('should throw an error when delete operation fails', async () => {
      const username = 'errorUser';
      (userRepository.delete as jest.Mock).mockRejectedValue(
        new Error('Delete operation failed'),
      );

      await expect(userService.deleteUserByUsername(username)).rejects.toThrow(
        'Delete operation failed',
      );
      expect(userRepository.delete).toHaveBeenCalledWith({
        username: username,
      });
    });
  });

  describe('getUserByUsername', () => {
    test('should return a user when a valid username is provided', async () => {
      const username = 'testUser';
      const expectedUser = {
        id: 1,
        username: '张34',
        firstName: 'jame1s',
        lastName: 'harde1n',
        email: 't1est@qq.com',
        password: '123456',
        phone: '15166644745',
        userStatus: 0,
      };
      (userRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        username: '张34',
        firstName: 'jame1s',
        lastName: 'harde1n',
        email: 't1est@qq.com',
        password: '123456',
        phone: '15166644745',
        userStatus: 0,
      });

      const user = await userService.getUserByUsername(username);

      expect(user).toEqual(expectedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
    });

    test('should return null when user is not found', async () => {
      const username = 'nonExistingUser';
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      const user = await userService.getUserByUsername(username);

      expect(user).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
    });

    test('should throw an error when the repository operation fails', async () => {
      const username = 'errorUser';
      const errorMessage = 'Database Error';
      (userRepository.findOne as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );
      await expect(userService.getUserByUsername(username)).rejects.toThrow(
        errorMessage,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });

  describe('createUser', () => {
    test('should return affected when createUser is successful', async () => {
      const expectedUser = {
        id: 1,
        username: '张34',
        firstName: 'jame1s',
        lastName: 'harde1n',
        email: 't1est@qq.com',
        password: '123456',
        phone: '15166644745',
        userStatus: 0,
      };
      (userRepository.insert as jest.Mock).mockResolvedValue({ affected: 1 });
      const result = await userService.createUser(expectedUser);
      expect(result).toEqual({ affected: 1 });
      expect(userRepository.insert).toHaveBeenCalledWith(expectedUser);
    });

    test('should throw an error when the repository insert operation fails', async () => {
      const user = {
        id: 1,
        username: '',
        firstName: '',
        lastName: 'harde1n',
        email: 't1est@qq.com',
        password: '123456',
        phone: '15166644745',
        userStatus: 0,
      }; // 示例用户对象
      const errorMessage = 'Database Error';
      (userRepository.insert as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );
      await expect(userService.createUser(user)).rejects.toThrow(errorMessage);
      expect(userRepository.insert).toHaveBeenCalledWith(user);
    });
  });

  describe('updateUserInfo', () => {
    test('should update user info when user exists', async () => {
      const username = 'existingUser';
      const updateUserDto = {
        id: 1,
        username: '张34',
        firstName: 'jame1s',
        lastName: 'harde1n',
        email: 't1est@qq.com',
        password: '123456',
        phone: '15166644745',
        userStatus: 0,
      };
      // 模拟 getUserByUsername 返回用户信息
      jest
        .spyOn(userService, 'getUserByUsername')
        .mockResolvedValue(updateUserDto);
      // 模拟仓库的 update 方法
      (userRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      await userService.updateUserInfo(username, updateUserDto);
      expect(userRepository.update).toHaveBeenCalledWith(
        { username: username },
        updateUserDto,
      );
    });

    test('should throw NotFoundException when user does not exist', async () => {
      const username = 'nonExistingUser';
      const updateUserDto = {
        id: 1,
        username: '张34',
        firstName: 'jame1s',
        lastName: 'harde1n',
        email: 't1est@qq.com',
        password: '123456',
        phone: '15166644745',
        userStatus: 0,
      };

      // 模拟 getUserByUsername 返回 null
      jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(null);
      await expect(
        userService.updateUserInfo(username, updateUserDto),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });
});
