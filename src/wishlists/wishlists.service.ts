import { Injectable } from '@nestjs/common';
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

  async findAll() {
    return await this.wishlistRepository.find({
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
    });
  }
}
