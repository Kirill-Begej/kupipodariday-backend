import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { RELATIONS_WISHLIST_FIND } from 'src/constants/relations-db.constants';
import { SELECT_USER_NOT_EMAIL_NOT_PASSWORD } from 'src/constants/selections-db.constants';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto | UpdateWishlistDto,
    id: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { itemsId, ...rest } = createWishlistDto;
      const owner = await this.usersService.find({ id }, false, false);
      const items = await this.wishesService.findByIds(itemsId);

      return await this.wishlistRepository.save({ ...rest, owner, items });
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async find(id: number = 0) {
    const req = {
      relations: RELATIONS_WISHLIST_FIND,
      select: {
        owner: SELECT_USER_NOT_EMAIL_NOT_PASSWORD,
      },
    };

    if (id) {
      Object.defineProperty(req, 'where', {
        value: { id: +id },
        writable: true,
        enumerable: true,
        configurable: true,
      });

      const wishlist = await this.wishlistRepository.findOne(req);

      if (!wishlist) {
        throw new HttpException(
          'Список подарков не найден',
          HttpStatus.NOT_FOUND,
        );
      }

      return wishlist;
    }

    return await this.wishlistRepository.find(req);
  }

  async updateWishlist(
    updateWishlistDto: UpdateWishlistDto,
    id: number,
    paramId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.checkOwner(id, paramId);
      const { itemsId, ...rest } = updateWishlistDto;
      const items = await this.wishesService.findByIds(itemsId);

      const actualWish = await this.wishlistRepository
        .createQueryBuilder()
        .relation(Wishlist, 'items')
        .of({ id: paramId })
        .loadMany();

      await this.wishlistRepository
        .createQueryBuilder()
        .relation(Wishlist, 'items')
        .of({ id: paramId })
        .addAndRemove(items, actualWish);

      this.wishlistRepository.update(paramId, { ...rest });

      return this.find(paramId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, err.code);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteWishlist(id: number, paramId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wishlist = await this.checkOwner(id, paramId);

      await this.wishlistRepository.delete(paramId);

      return wishlist;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, err.code);
    } finally {
      await queryRunner.release();
    }
  }

  async checkOwner(id: number, paramId: number) {
    const wishlist: any = await this.find(paramId);

    if (id !== wishlist.owner.id) {
      throw {
        message: 'Можно обновлять или удалять только свои списки подарков',
        code: HttpStatus.CONFLICT,
      };
    }

    return wishlist;
  }
}
