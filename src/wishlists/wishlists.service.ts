import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, id: number) {
    const { itemsId, ...rest } = createWishlistDto;
    const owner = await this.usersService.find({ id }, false, false);
    const items = await this.wishesService.findByIds(itemsId);

    return await this.wishlistRepository.save({ ...rest, owner, items });
  }

  async find(id: number = 0) {
    const req = {
      relations: ['owner', 'items'],
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          email: false,
          password: false,
          createdAt: true,
          updateAt: true,
        },
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
}
