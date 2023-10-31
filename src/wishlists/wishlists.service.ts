import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist) private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    try {
      return await this.wishlistRepository.save(createWishlistDto);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new HttpException(
          'Переданы некорректные данные',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll() {
    return await this.wishlistRepository.find();
  }
}
