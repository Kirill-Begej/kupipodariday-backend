import {
  HttpException,
  HttpStatus,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  QueryFailedError,
  Repository,
  DataSource,
} from 'typeorm';
import { validate } from 'class-validator';
import { HashingService } from 'src/hashing/hashing.service';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import {
  IUser,
  IWishAndOwnerAndOffers,
  IWishFindByUsername,
} from 'src/types/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(forwardRef(() => WishesService))
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser | HttpException> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { password, ...userData } = createUserDto;
      const user = await this.userRepository.save({
        ...userData,
        password: await this.hashingService.hashing(password),
      });

      delete user.password;

      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          'Пользователь с таким email или username уже зарегистрирован',
          HttpStatus.CONFLICT,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }

  async find(
    findBy: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    showPassword: boolean = true,
    showEmail: boolean = true,
  ): Promise<IUser> {
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
        updatedAt: true,
      },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<IUser> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { password, ...userData } = updateUserDto;

      const user = password
        ? { ...userData, password: await this.hashingService.hashing(password) }
        : updateUserDto;

      await this.userRepository.update(id, user);

      return this.find({ id }, false);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findWishes(id: number): Promise<IWishAndOwnerAndOffers[]> {
    return this.wishesService.findByUserId(id);
  }

  async findUserWishes(username: string): Promise<IWishFindByUsername[]> {
    return this.wishesService.findByUsername(username);
  }

  async findMany(query: string): Promise<IUser[]> {
    const queryUser = new QueryUserDto();
    queryUser.email = query;

    const user = (await validate(queryUser)).length
      ? [await this.find({ username: query }, false)]
      : [await this.find({ email: query }, false)];

    return user[0] ? user : [];
  }
}
