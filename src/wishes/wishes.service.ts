import {
  HttpException,
  HttpStatus,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import {
  SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
  SELECT_FIND_WISH,
  SELECT_COPY_WISH,
  SELECT_OWNER_NOT_DATA,
} from 'src/constants/db.constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWishDto: CreateWishDto, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersService.find({ id }, false, false);
      await this.wishRepository.save({ ...createWishDto, owner: user });
      return {};
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findByIds(ids: number[]) {
    return await this.wishRepository.find({ where: { id: In(ids) } });
  }

  async findByUsername(username: string) {
    return this.wishRepository.find({
      where: {
        owner: {
          username: username,
        },
      },
      relations: ['owner'],
      select: {
        owner: SELECT_OWNER_NOT_DATA,
      },
    });
  }

  async findSortWishes(sortBy: { [value: string]: string }, amount: number) {
    return await this.wishRepository.find({
      relations: ['owner'],
      order: sortBy,
      take: amount,
      select: {
        owner: SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
      },
    });
  }

  async findWishForOffers(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!wish) {
      throw {
        message: 'Подарок не найден',
        code: HttpStatus.NOT_FOUND,
      };
    }

    return wish;
  }

  async updateFields(id, data) {
    return await this.wishRepository.update(id, data);
  }

  async findWish(paramId: number, id: number) {
    const { owner, offers, ...rest } = await this.wishRepository.findOne({
      where: { id: paramId },
      relations: ['owner', 'offers', 'offers.user'],
      select: SELECT_FIND_WISH,
    });

    if (!owner) {
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    }

    if (owner.id === id) {
      return { ...rest, offers };
    }

    const sortOffers = offers.map((item) => {
      if (item.hidden) {
        delete item.user;
      }

      return item;
    });

    return { ...rest, sortOffers };
  }

  async updateWish(updateWishDto: UpdateWishDto, paramId: number, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { owner, raised } = await this.wishRepository.findOne({
        where: { id: paramId },
        relations: ['owner'],
        select: {
          id: true,
          raised: true,
          owner: {
            id: true,
          },
        },
      });

      if (owner.id !== id) {
        throw {
          message: 'Нельзя изменять чужие подарки',
          code: HttpStatus.FORBIDDEN,
        };
      }

      if (updateWishDto.hasOwnProperty('price') && +raised) {
        throw {
          message:
            'Нельзя изменять стоимость подарка, если уже есть желающие скинуться',
          code: HttpStatus.FORBIDDEN,
        };
      }

      await this.wishRepository.update(paramId, updateWishDto);
      return {};
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, err.code);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteWish(paramId: number, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { owner, ...rest } = await this.wishRepository.findOne({
        where: { id: paramId },
        relations: ['owner'],
      });

      if (owner.id !== id) {
        throw {
          message: 'Нельзя удалять чужие подарки',
          code: HttpStatus.FORBIDDEN,
        };
      }

      await this.wishRepository.delete(paramId);

      return { ...rest };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, err.code);
    } finally {
      await queryRunner.release();
    }
  }

  async copyWish(paramId: number, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { owner, copied, ...rest } = await this.wishRepository.findOne({
        where: { id: paramId },
        relations: ['owner'],
        select: SELECT_COPY_WISH,
      });

      if (owner.id === id) {
        throw {
          message: 'Нельзя скопировать себе свой подарок',
          code: HttpStatus.FORBIDDEN,
        };
      }

      const copyWish = { ...rest, copied: 0 };
      delete copyWish.id;
      delete copyWish.createdAt;
      delete copyWish.updateAt;

      this.updateFields(paramId, { copied: copied + 1 });
      this.create(copyWish, id);
      return {};
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, err.code);
    } finally {
      await queryRunner.release();
    }
  }
}
