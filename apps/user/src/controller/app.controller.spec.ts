import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from '../service/app.service';

jest.mock('../service/app.service'); // 模拟AppService

describe('UserController', () => {
  let controller: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('deleteUser', () => {
    test('should call appService.deleteUserByUsername with correct username', async () => {
      const username = 'testUser';
      const result = { raw: 1, affected: 1 }; // 假设这是你的成功消息
      jest.spyOn(appService, 'deleteUserByUsername').mockResolvedValue(result); // 模拟返回成功消息

      const response = await controller.deleteUser(username);
      expect(response).toBe(result); // 验证返回值是否正确
      expect(appService.deleteUserByUsername).toHaveBeenCalledWith(username); // 验证是否使用正确的用户名调用了方法
    });

    test('should throw an error when appService.deleteUserByUsername fails', async () => {
      const username = 'testUser';
      jest
        .spyOn(appService, 'deleteUserByUsername')
        .mockRejectedValue(new Error('User not found')); // 模拟抛出一个错误

      await expect(controller.deleteUser(username)).rejects.toThrow(
        'User not found',
      ); // 验证是否抛出了预期的错误
    });
  });

  describe('createUserInfo', () => {
    test('should call appService.createUser with correct user data', async () => {
      const mockUser = {
        id: 1,
        username: '张34',
        firstName: 'jame1s',
        lastName: 'harde1n',
        email: 't1est@qq.com',
        password: '123456',
        phone: '15166644745',
        userStatus: 0,
      };
      const insertResult = {
        identifiers: [{ id: 1 }],
        generatedMaps: [{ id: 1 }],
        raw: 1,
      };
      jest.spyOn(appService, 'createUser').mockResolvedValue(insertResult);

      const response = await controller.createUserInfo(mockUser);
      expect(response).toEqual(insertResult);
      expect(appService.createUser).toHaveBeenCalledWith(mockUser);
    });

    test('should handle errors when appService.createUser fails', async () => {
      const mockUser = {
        id: 1,
        username: '张34',
        firstName: 'jame1s',
        lastName: 'harde1n',
        email: 't1est@qq.com',
        password: '123456',
        phone: '15166644745',
        userStatus: 0,
      };
      const errorMessage = 'Invalid email address';
      jest
        .spyOn(appService, 'createUser')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.createUserInfo(mockUser)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user by username', async () => {
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
      jest
        .spyOn(appService, 'getUserByUsername')
        .mockResolvedValue(expectedUser);

      const result = await controller.getUserByUsername(username);

      expect(result).toEqual(expectedUser);
    });

    test('should handle errors when getUserByUsername fails', async () => {
      const username = 'nonexistentUser';
      jest
        .spyOn(appService, 'getUserByUsername')
        .mockRejectedValue(new Error('User not found'));

      await expect(controller.getUserByUsername(username)).rejects.toThrow(
        'User not found',
      );
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
      const updateResult = { raw: 1, affected: 1, generatedMaps: [{ id: 1 }] };
      jest.spyOn(appService, 'updateUserInfo').mockResolvedValue(updateResult);
      const response = await controller.updateUserInfo(username, updateUserDto);
      expect(response).toBe(updateResult);
      expect(appService.updateUserInfo).toHaveBeenCalledWith(
        username,
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

      jest
        .spyOn(appService, 'updateUserInfo')
        .mockRejectedValue(new Error('User not found')); // 这里我们创建一个Error对象

      await expect(
        controller.updateUserInfo(username, updateUserDto),
      ).rejects.toThrow('User not found');
    });
  });
});
