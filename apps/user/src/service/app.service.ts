import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/repository/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '../entities/dto/update.user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Find user information based on username
   * @param username
   */
  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  /**
   * Create a user
   * @param user Information about the user to be created
   */
  createUser(user: User) {
    let resultPromise = this.userRepository.insert(user);
    console.log("resultPromise: "+resultPromise);
    return resultPromise.then(value => {
      console.log("createUser: "+value);
      return value;
    })
  }

  /**
   * Update user information based on username
   * @param username Specifies the username to be updated
   * @param updateUserDto
   */
  async updateUserInfo(username: string, updateUserDto: UpdateUserDto) {
    const userInfo = await this.getUserByUsername(username);
    if (!userInfo) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.update(
      { username: username },
      updateUserDto,
    );
  }

  /**
   * Delete user information based on the username
   * @param username
   */
  async deleteUserByUsername(username: string) {
    return this.userRepository.delete({ username: username });
  }
}
