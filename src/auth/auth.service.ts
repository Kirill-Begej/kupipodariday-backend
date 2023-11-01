import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.findOne(username);
      const passwordIsMatch = await bcrypt.compare(password, user.password);

      if (!passwordIsMatch) {
        throw new Error();
      }

      return user;
    } catch (err) {
      throw new HttpException(
        'Некорректная пара логин и пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
