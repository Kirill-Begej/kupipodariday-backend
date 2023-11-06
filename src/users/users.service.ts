import {
  HttpException,
  HttpStatus,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { validate } from 'class-validator';
import { HashingService } from 'src/hashing/hashing.service';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(forwardRef(() => WishesService))
    private readonly wishesService: WishesService,
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

  async find(
    findBy: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    showPassword: boolean = true,
    showEmail: boolean = true,
  ) {
    return await this.userRepository.findOne({
      where: findBy,
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

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;

    const user = password
      ? { ...userData, password: await this.hashingService.hashing(password) }
      : updateUserDto;

    await this.userRepository.update(id, user);

    return this.find({ id }, false);
  }

  async findWishes(id: number) {
    return await this.userRepository.find({
      where: { id },
    });
  }

  async findAnotherUserWishes(username: string) {
    return this.wishesService.findByUsername(username);
  }

  async findMany(query: string) {
    const queryUser = new QueryUserDto();
    queryUser.email = query;

    const result = (await validate(queryUser)).length
      ? [await this.find({ username: query }, false)]
      : [await this.find({ email: query }, false)];

    if (!result[0]) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
