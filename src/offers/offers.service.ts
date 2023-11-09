import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { UsersService } from 'src/users/users.service';
import { SELECT_OFFERS_FIND } from 'src/constants/selections-db.constants';
import { RELATIONS_OFFERS_FIND } from 'src/constants/relations-db.constants';
import { IOffersAndItemAndUser } from 'src/types/types';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createOfferDto: CreateOfferDto,
    id: number,
  ): Promise<object | Error> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { itemId, ...rest } = createOfferDto;
      const user = await this.usersService.find({ id }, false);
      const wish = await this.wishesService.findWishForOffers(itemId);
      let totalRaised: number;

      if (!(wish instanceof Error) && id === wish.owner.id) {
        throw {
          message: 'Hельзя вносить деньги на собственные подарки',
          code: HttpStatus.FORBIDDEN,
        };
      }

      if (!(wish instanceof Error)) {
        totalRaised = +createOfferDto.amount.toFixed(2) + +wish.raised;
      }

      if (!(wish instanceof Error) && totalRaised > wish.price) {
        throw {
          message:
            'Сумма собранных средств не может превышать стоимость подарка',
          code: HttpStatus.FORBIDDEN,
        };
      }

      await this.wishesService.updateFields(itemId, { raised: totalRaised });

      await this.offersRepository.save({
        ...rest,
        item: wish,
        user,
      });
      return {};
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, err.code);
    } finally {
      await queryRunner.release();
    }
  }

  async find(
    id = 0,
  ): Promise<IOffersAndItemAndUser | IOffersAndItemAndUser[] | Error> {
    if (id) {
      const offer = await this.offersRepository.findOne({
        where: { id },
        relations: RELATIONS_OFFERS_FIND,
        select: SELECT_OFFERS_FIND,
      });

      if (!offer) {
        throw new HttpException('Не найдено', HttpStatus.NOT_FOUND);
      }

      return offer;
    }

    return await this.offersRepository.find({
      relations: RELATIONS_OFFERS_FIND,
      select: SELECT_OFFERS_FIND,
    });
  }
}
