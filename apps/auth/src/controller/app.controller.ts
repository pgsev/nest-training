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

}
