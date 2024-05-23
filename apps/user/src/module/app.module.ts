import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/repository/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from '../guard/user.guard';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { USER_CONSTANTS } from '../entities/constant/user.constants';
import configuration from '../configuration/configuration';
import { CommonModule } from "../../../common/common.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
      secret: USER_CONSTANTS.JWT_SECRET,
      signOptions: { expiresIn: USER_CONSTANTS.JWT_EXPIRES_IN },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get(USER_CONSTANTS.REDIS),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get(USER_CONSTANTS.DB_ENV),
    }),
    TypeOrmModule.forFeature([User]),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
})
export class AppModule {}
