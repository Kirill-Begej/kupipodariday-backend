import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.userRepository.save(createUserDto);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          'Пользователь с таким логином или email уже зарегистрирован',
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
