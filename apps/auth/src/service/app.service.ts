import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "../entities/dto/login.dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "../entities/dto/register.dto";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";
import { UrlJointUtil } from "../util/url.joint.util";
import { AUTH_CONSTANTS } from "../entities/constant/auth.constants";

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis
  ) {
  }

  async login(loginDto: LoginDto) {
    const response = await firstValueFrom(
      this.httpService.get(this.getUserServiceUrl() + loginDto.username)
    );
    const respUserInfo = response.data.data;
    if (!respUserInfo) {
      throw new UnauthorizedException();
    }
    if (respUserInfo.password !== loginDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: respUserInfo.id, username: respUserInfo.username };
    const token = this.jwtService.sign(payload);
    this.redis.set(
      `${respUserInfo.id}&${respUserInfo.username}`,
      token,
      "EX",
      1800
    );
    return {
      access_token: token
    };
  }

  async register(registerDto: RegisterDto):Promise<any> {
    const value = await firstValueFrom(
      this.httpService.post(this.getUserServiceUrl(), registerDto)
    )
    if (value.data){
      return {
        affected_rows: value.data.data.raw.length,
      };
    }
    return {affected_rows:AUTH_CONSTANTS.ZERO_VALUE};

  }

  async logout(req) {
    const redisKey = `${req.user.sub}&${req.user.username}`;
    const cacheToken = await this.redis.get(redisKey);
    if (!cacheToken) {
      throw new UnauthorizedException("token expired");
    }
    return this.redis.del(redisKey);
  }



  private getUserServiceUrl() {
    return UrlJointUtil.UserUrlJoint(
      this.configService.get("user-service.host"),
      this.configService.get("user-service.port")
    );
  }

}
