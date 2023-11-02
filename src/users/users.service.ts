import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { HashingService } from 'src/hashing/hashing.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = await this.userRepository.save({
        ...userData,
        password: await this.hashingService.hashing(password),
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

  async findByUsername(
    username: string,
    showEmail: boolean = true,
    showPassword: boolean = true,
  ) {
    return await this.userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: showEmail,
        password: showPassword,
        createdAt: true,
        updateAt: true,
      },
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updateAt: true,
      },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;

    const user = password
      ? { ...userData, password: await this.hashingService.hashing(password) }
      : updateUserDto;

    await this.userRepository.update(id, user);

    return this.findById(id);
  }
}
