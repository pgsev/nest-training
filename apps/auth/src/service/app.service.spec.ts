import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { RegisterDto } from '../entities/dto/register.dto';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisModule } from '@nestjs-modules/ioredis';

// 模拟数据
const mockRegisterDto: RegisterDto = {
  // 根据你的RegisterDto结构填写相应的模拟数据
  username: "张34",
  firstName: "jame1s",
  lastName: "harde1n",
  email: "t1est@qq.com",
  password: "123456",
  phone: "15166644745",
  userStatus: 0
};

const mockSuccessResponse: AxiosResponse = {
  data: {
    data: {
      raw: ['some', 'mock', 'data'], // 假设这是数据库返回的数据，表示有3行受影响
    },
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: undefined,
  },
  request: {},
};

const mockFailureResponse: AxiosResponse = {
  data: null,
  status: 400,
  statusText: 'Bad Request',
  headers: {},
  config: {
    headers: undefined,
  },
  request: {},
};

describe('AppService', () => {
  let authService: AppService;
  let httpService: HttpService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let redis: Redis;

  beforeEach(async () => {
    const redisClientMock = {
      get: jest.fn(),
      set: jest.fn(),
    };
  },
    beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        RedisModule.forRoot({
          type: 'single',
          options: {
            host: 'localhost',
            port: 6379,
          },
        }),
      ],
      providers: [
        AppService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: Redis,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AppService>(AppService);
    httpService = module.get<HttpService>(HttpService);
  }))

  it('should return affected rows when registration is successful', async () => {
    // Arrange
    (httpService.post as jest.Mock).mockReturnValueOnce(of(mockSuccessResponse));

    // Act
    const result = await authService.register(mockRegisterDto);

    // Assert
    expect(result).toEqual({ affected_rows: 3 });
  });

  it('should return zero affected rows when registration fails', async () => {
    // Arrange
    (httpService.post as jest.Mock).mockReturnValueOnce(of(mockFailureResponse));

    // Act
    const result = await authService.register(mockRegisterDto);

    // Assert
    expect(result).toEqual({ affected_rows: 0 }); // 假设 AUTH_CONSTANTS.ZERO_VALUE 为 0
  });

  it('should handle errors during the HTTP request', async () => {
    // Arrange
    (httpService.post as jest.Mock).mockReturnValueOnce(throwError(() => new Error('Network Error')));

    // Act & Assert
    await expect(authService.register(mockRegisterDto)).rejects.toThrow('Network Error');
  });
});