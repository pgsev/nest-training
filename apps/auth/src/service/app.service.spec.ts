// import { Test, TestingModule } from '@nestjs/testing';
// import { AppService } from './app.service';
// import { HttpService } from '@nestjs/axios';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
//
// import { UnauthorizedException } from '@nestjs/common';
// import Redis from 'ioredis';
//
// jest.mock('@nestjs/axios');
// jest.mock('@nestjs/jwt');
// jest.mock('@nestjs/config');
// jest.mock('nestjs-redis');
//
// describe('AppService', () => {
//   let appService: AppService;
//   let httpService: HttpService;
//   let jwtService: JwtService;
//   let configService: ConfigService;
//   let redis: Redis;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AppService,
//         {
//           provide: HttpService,
//           useValue: {
//             get: jest.fn(),
//             post: jest.fn(),
//           },
//         },
//         {
//           provide: JwtService,
//           useValue: {
//             sign: jest.fn(() => 'mock-jwt-token'),
//           },
//         },
//         {
//           provide: ConfigService,
//           useValue: {
//             get: jest.fn(),
//           },
//         },
//         {
//           provide: Redis,
//           useValue: {
//             get: jest.fn(),
//             set: jest.fn(),
//             del: jest.fn(),
//           },
//         },
//       ],
//     }).compile();
//
//     appService = module.get<AppService>(AppService);
//     httpService = module.get<HttpService>(HttpService);
//     jwtService = module.get<JwtService>(JwtService);
//     configService = module.get<ConfigService>(ConfigService);
//     redis = module.get<Redis>(Redis);
//   });
//
//   describe('login', () => {
//     it('should return access token on successful login', async () => {
//       const loginDto = { username: 'test', password: 'password' };
//       const responseData = {
//         data: { id: 1, username: 'test', password: 'password' },
//       };
//       (httpService.get as jest.Mock).mockResolvedValue({ data: responseData });
//       const configHost = 'user-service';
//       const configPort = 3000;
//       (configService.get as jest.Mock)
//         .mockReturnValueOnce(configHost)
//         .mockReturnValueOnce(configPort);
//
//       const result = await appService.login(loginDto);
//       expect(result).toEqual({ access_token: 'mock-jwt-token' });
//     });
//
//     it('should throw UnauthorizedException when user not found', async () => {
//       const loginDto = { username: 'test', password: 'password' };
//       (httpService.get as jest.Mock).mockResolvedValue({ data: null });
//
//       await expect(appService.login(loginDto)).rejects.toThrow(
//         UnauthorizedException,
//       );
//     });
//
//     it('should throw UnauthorizedException when password is incorrect', async () => {
//       const loginDto = { username: 'test', password: 'wrongpassword' };
//       const responseData = {
//         data: { id: 1, username: 'test', password: 'password' },
//       };
//       (httpService.get as jest.Mock).mockResolvedValue({ data: responseData });
//
//       await expect(appService.login(loginDto)).rejects.toThrow(
//         UnauthorizedException,
//       );
//     });
//   });
// });
