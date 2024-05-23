// import { AppController } from './app.controller';
// import { AppService } from '../service/app.service';
// import { HttpService } from '@nestjs/axios';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { InjectRedis } from '@nestjs-modules/ioredis';
// import Redis from 'ioredis';
// import { LoginDto } from '../entities/dto/login.dto';
// import { RegisterDto } from '../entities/dto/register.dto';
//
// describe('AppController', () => {
//   let authController: AppController;
//   let authService: AppService;
//   let httpService: HttpService;
//   let jwtService: JwtService;
//   let configService: ConfigService;
//   let redis: Redis;
//
//   beforeEach(() => {
//     httpService = new HttpService();
//     jwtService = new JwtService();
//     redis = new Redis({});
//     configService = new ConfigService();
//     authService = new AppService(httpService, jwtService, configService, redis);
//     authController = new AppController(authService);
//   });
//
//   describe('login', () => {
//     it('should return a token', async () => {
//       const loginDto: LoginDto = {
//         username: '张三',
//         password: '123456',
//       };
//       const token = '123';
//       jest
//         .spyOn(authService, 'login')
//         .mockImplementation(() => Promise.resolve({ access_token: token }));
//
//       expect(await authController.login(loginDto)).toStrictEqual({
//         access_token: token,
//       });
//     });
//   });
//
//   describe('register', () => {
//     it('should return affected_rows', async () => {
//       const register: RegisterDto = {
//         username: '张25',
//         firstName: 'jame1s',
//         lastName: 'harde1n',
//         email: 't1est@qq.com',
//         password: '123456',
//         phone: '15166644745',
//         userStatus: 0,
//       };
//       const result = {
//         affected_rows: 1,
//       };
//       jest
//         .spyOn(authService, 'register')
//         .mockImplementation(() => Promise.resolve(result));
//
//       expect(await authController.register(register)).toBe(result);
//     });
//   });
//
//   describe('logout', () => {
//     it('should return success', async () => {
//       const result = 1;
//       jest
//         .spyOn(authService, 'logout')
//         .mockImplementation(() => Promise.resolve(result));
//       expect(await authController.logout(null)).toBe(result);
//     });
//   });
// });
