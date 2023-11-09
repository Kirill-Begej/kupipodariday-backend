import {
  HttpException,
  HttpStatus,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource, UpdateResult } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';
import {
  RELATIONS_WISHES_FIND_BY_USERNAME,
  RELATIONS_WISHES_FIND,
  RELATIONS_WISH_FIND,
} from 'src/constants/relations-db.constants';
import {
  SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
  SELECT_WISHES_FIND_BY_USERNAME,
  SELECT_WISH_COPY,
  SELECT_WISH_FIND,
  SELECT_WISH_UPDATE,
} from 'src/constants/selections-db.constants';
import {
  IWishAndOwner,
  IWishAndOwnerAndOffers,
  IWishFindByUsername,
} from 'src/types/types';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWishDto: CreateWishDto, id: number): Promise<object> {
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

  async findByUserId(id: number): Promise<IWishAndOwnerAndOffers[]> {
    return await this.wishRepository.find({
      where: {
        owner: { id },
      },
      relations: RELATIONS_WISHES_FIND,
      select: {
        owner: SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
      },
    });
  }

  async findByUsername(username: string): Promise<IWishFindByUsername[]> {
    return this.wishRepository.find({
      where: {
        owner: {
          username: username,
        },
      },
      relations: RELATIONS_WISHES_FIND_BY_USERNAME,
      select: SELECT_WISHES_FIND_BY_USERNAME,
    });
  }

  async findSortWishes(
    sortBy: { [value: string]: string },
    amount: number,
  ): Promise<IWishAndOwnerAndOffers[]> {
    return await this.wishRepository.find({
      relations: RELATIONS_WISHES_FIND,
      order: sortBy,
      take: amount,
      select: {
        owner: SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
      },
    });
  }

  async findWishForOffers(id: number): Promise<IWishAndOwner | Error> {
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

  async updateFields(id, data): Promise<UpdateResult> {
    return await this.wishRepository.update(id, data);
  }

  async findWish(paramId: number, id: number): Promise<IWishAndOwnerAndOffers> {
    const { owner, offers, ...rest } = await this.wishRepository.findOne({
      where: { id: paramId },
      relations: RELATIONS_WISH_FIND,
      select: SELECT_WISH_FIND,
    });

    if (owner.id === id) {
      return { ...rest, owner, offers };
    }

    offers.map((item, i) => {
      if (item.hidden) {
        offers.splice(i, 1);
      }
    });

    return { ...rest, owner, offers };
  }

  async updateWish(
    updateWishDto: UpdateWishDto,
    paramId: number,
    id: number,
  ): Promise<object | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { owner, raised } = await this.wishRepository.findOne({
        where: { id: paramId },
        relations: ['owner'],
        select: SELECT_WISH_UPDATE,
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

  async deleteWish(
    paramId: number,
    id: number,
  ): Promise<IWishAndOwnerAndOffers | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.wishRepository.findOne({
        where: { id: paramId },
        relations: RELATIONS_WISHES_FIND,
      });

      if (wish.owner.id !== id) {
        throw {
          message: 'Нельзя удалять чужие подарки',
          code: HttpStatus.FORBIDDEN,
        };
      }

      await this.wishRepository.delete(paramId);

      return wish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, err.code);
    } finally {
      await queryRunner.release();
    }
  }

  async copyWish(paramId: number, id: number): Promise<object | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { owner, copied, ...rest } = await this.wishRepository.findOne({
        where: { id: paramId },
        relations: ['owner'],
        select: SELECT_WISH_COPY,
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
      delete copyWish.updatedAt;

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
