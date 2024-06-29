import { User } from '@entities';
import { BaseService } from '@lib';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { PasswordUtils } from 'src/utils';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    usersRepository: Repository<User>
  ) {
    super(usersRepository);
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...restDto } = createUserDto;

    const hashedPassword = await PasswordUtils.hashPassword(password);
    const insertResult = await this.insert({ ...restDto, password: hashedPassword });
    const userId = insertResult.identifiers[0].id;

    return await this.findOne({ where: { id: userId } });
  }

  public async verifyUser(id: string) {
    return await this.update(id, { verified: true });
  }
}
