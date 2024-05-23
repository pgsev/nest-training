import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { IS_PUBLIC_KEY } from '../entities/decorator/isPublic';
import { Reflector } from '@nestjs/core';
import { USER_CONSTANTS } from '../entities/constant/user.constants';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let payload: { sub: any; username: any };
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: USER_CONSTANTS.JWT_SECRET,
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
    this.redis.set(redisKey, token, 'EX', 1800);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
