import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';
import { UsersService } from '@modules/users';
import { BaseResolver } from '@lib';

@Injectable()
export class AuthService extends BaseResolver {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  public async register(registerDto: RegisterDto) {
    const existUser = await this.usersService.findOneByLogin(registerDto.login);
    if (existUser) {
      throw new BadRequestException(this.wrapFail('User with this login already exist'));
    }
  }

  private getLoginType(login: string): 'phone' | 'email' {
    return login.includes('@') ? 'email' : 'phone'; // Simple validation
  }
}
