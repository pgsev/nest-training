import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { LoginDto } from '../entities/dto/login.dto';
import { RegisterDto } from '../entities/dto/register.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';

@ApiTags('auth operation')
@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'test interface' })
  @Get('getHello')
  async getHello() {
    return await this.appService.getHello();
  }

  /**
   * users login
   * @param loginDto
   */
  @ApiOperation({
    summary: 'login interface',
    description: 'interface for user login ',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.appService.login(loginDto);
  }

  /**
   * user registration
   * @param registerDto
   */
  @Post('register')
  @ApiOperation({
    summary: 'Registration interface',
    description: 'interface for user register ',
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.appService.register(registerDto);
  }

  /**
   * user logout
   * @param req
   */
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'logout interface' })
  @Get('logout')
  async logout(@Req() req: Request) {
    return await this.appService.logout(req);
  }

  /**
   * test interface
   */
  @ApiOperation({
    summary: 'login interface',
    description: 'interface for user login ',
  })
  @Get('config')
  async getConfig() {
    return await this.appService.getConfig();
  }
}
