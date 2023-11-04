import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, id: number) {
    const { itemId, ...rest } = createOfferDto;
    const user = await this.usersService.find({ id }, false);
    const wish = await this.wishesService.findWish(itemId);

    if (id === wish.owner.id) {
      throw new HttpException('Hельзя вносить деньги на собственные подарки', HttpStatus.FORBIDDEN);
    }

    const totalRaised = +createOfferDto.amount.toFixed(2) + +wish.raised;

    if (totalRaised > wish.price) {
      throw new HttpException('Сумма собранных средств не может превышать стоимость подарка', HttpStatus.FORBIDDEN);
    }

    await this.wishesService.update(itemId, { raised: totalRaised });

    await this.offersRepository.save({ ...rest, wish, user });
    return {};
  }
}
