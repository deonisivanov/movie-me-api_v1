import { User } from '@entities';
import { BaseService } from '@lib';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { PasswordUtils } from 'src/utils';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UsersService extends BaseService<User> {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    usersRepository: Repository<User>
  ) {
    super(usersRepository);
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...restDto } = createUserDto;

      const hashedPassword = await PasswordUtils.hashPassword(password);
      const insertResult = await this.insert({ ...restDto, password: hashedPassword });
      const userId = insertResult.identifiers[0].id;

      return await this.findOne({ where: { id: userId } });
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      throw new Error(error);
    }
  }

  public async verifyUser(id: string) {
    try {
      return await this.update(id, { verified: true });
    } catch (error) {
      this.logger.error(`Error verifying user with id: ${id}`, error.stack);
      throw new Error(error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  protected async removeUnverifiedUsers(): Promise<void> {
    try {
      await this.delete({ verified: false });
      this.logger.log(`Removed unverified users`);
    } catch (error) {
      this.logger.error('Error removing unverified users', error.stack);
    }
  }
}
