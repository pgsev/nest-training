import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from "ioredis";
import { AUTH_CONSTANTS } from '../entities/constant/auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let payload: { sub: any; username: any };
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: AUTH_CONSTANTS.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }
    const redisKey = `${payload.sub}&${payload.username}`;
    const cacheToken = await this.redis.get(redisKey);
    if (!cacheToken) {
      throw new UnauthorizedException('token expired');
    }
    request['user'] = payload;
    // token续期
    this.redis.set(redisKey, token, 'EX', 1800);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
