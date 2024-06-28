import { User } from '@entities';
import { BaseService } from '@lib';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    usersRepository: Repository<User>
  ) {
    super(usersRepository);
  }

  public async findOneByLogin(login: string): Promise<User> {
    return await this.findOne({ where: { login } });
  }
}
