import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from '../service/app.service';
import { User } from '../entities/repository/user.entity';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../entities/decorator/isPublic';
import { UpdateUserDto } from '../entities/dto/update.user.dto';

@ApiTags('user-interface')
@Controller('user')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}



  /**
   * Get user information by username
   * @param username
   */
  @Public()
  @ApiOperation({ summary: 'Get user information by username' })
  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return await this.appService.getUserByUsername(username);
  }

  /**
   * Update user information based on username
   * @param username
   * @param updateUserDto
   */
  @ApiOperation({ summary: 'Update user information based on username' })
  @Put(':username')
  async updateUserInfo(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.appService.updateUserInfo(username, updateUserDto);
  }

  /**
   * create user information based on username
   * @param user
   */
  @Public()
  @ApiOperation({ summary: 'create user information based on username' })
  @Post()
  async createUserInfo(@Body() user: User) {
    return await this.appService.createUser(user);
  }

  /**
   * delete user entity by username
   * @param username
   */
  @ApiOperation({ summary: 'delete user entity by username' })
  @Delete(':username')
  async deleteUser(@Param('username') username: string) {
    return await this.appService.deleteUserByUsername(username);
  }
}
