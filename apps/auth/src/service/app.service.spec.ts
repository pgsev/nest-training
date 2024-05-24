import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { of } from 'rxjs';

jest.mock('@nestjs/axios', () => ({
  HttpService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue({ data: 'mocked data' }),
    // 你可以添加其他HttpService中需要模拟的方法
    post: jest.fn().mockResolvedValue({ data: 'mocked data' }),
  })),
}));
jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    // 你可以添加JwtService中其他需要模拟的方法
  })),
}));
jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockImplementation((key) => {
      // 根据key返回模拟的配置值，或者可以定义一个默认值
      switch (key) {
        case 'SOME_CONFIG_KEY':
          return 'mocked config value';
        // 添加其他配置项
        default:
          return 'default mocked config value';
      }
    }),
  })),
}));
jest.mock('ioredis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue('mocked redis value'),
    set: jest.fn().mockResolvedValue('OK'),
    // 你可以添加Redis中其他需要模拟的方法
  })),
}));

const ioredis = require('ioredis');

describe('AppService', () => {
  let appService: AppService;
  let httpService: HttpService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let redis: Redis;

  beforeEach(async () => {
    httpService = new HttpService();
    jwtService = new JwtService();
    configService = new ConfigService();
    redis = new ioredis.Redis();
    appService = new AppService(httpService, jwtService, configService, redis);
  });

  describe('login', () => {
    test('should return access token on successful login', async () => {
      const loginDto = { username: 'test', password: 'password' };
      const responseData = {
        data: {
          data: { id: 1, username: 'test', password: 'password' },
        },
      };
      (httpService.get as jest.Mock).mockReturnValue(of(responseData));
      const configHost = 'user-service';
      const configPort = 3000;
      (configService.get as jest.Mock)
        .mockReturnValueOnce(configHost)
        .mockReturnValueOnce(configPort);
      const result = await appService.login(loginDto);
      expect(result).toEqual({ access_token: 'mock-jwt-token' });
    });

    test('should throw UnauthorizedException when user not found', async () => {
      const loginDto = { username: 'test', password: 'password' };
      const responseData = {
        data: {
          id: 1,
          username: 'test',
          password: 'password',
        },
      };
      (httpService.get as jest.Mock).mockReturnValue(of(responseData));

      await expect(appService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    test('should throw UnauthorizedException when password is incorrect', async () => {
      const loginDto = { username: 'test', password: 'wrongpassword' };
      const responseData = {
        data: {
          data: { id: 1, username: 'test', password: 'password' },
        },
      };
      (httpService.get as jest.Mock).mockReturnValue(of(responseData));

      await expect(appService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {

  });

  describe('register', () => {});
});
