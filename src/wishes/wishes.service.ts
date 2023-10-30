import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
// import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto) {
    try {
      return await this.wishRepository.save(createWishDto);
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
    return await this.wishRepository.find();
  }
}
