import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const saltRounds = +this.configService.get('HASH_SALT');
      const { password, ...userData } = createUserDto;
      const user = await this.userRepository.save({
        ...userData,
        password: await bcrypt.hash(password, saltRounds),
      });

      delete user.password;

      return user;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          'Пользователь с таким email или username уже зарегистрирован',
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }
}
