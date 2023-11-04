import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, id: number) {
    const user = await this.usersService.find({ id }, false, false);
    await this.wishRepository.save({ ...createWishDto, owner: user });
    return {};
  }

  async findByIds(ids: number[]) {
    return await this.wishRepository.find({ where: { id: In(ids) } });
  }

  async findSortWishes(sortBy: {[value: string]: string}, amount: number) {
    const wishes = await this.wishRepository.find({
      relations: ['owner', 'offers'],
      order: sortBy,
      take: amount,
    });

    if (!wishes.length) {
      throw new HttpException('Подарки не найдены', HttpStatus.NOT_FOUND);
    }
    
    return wishes;
  }

  async findWish(id: number) {
    const wish = await this.wishRepository.findOne({ where: { id }, relations: ['owner'] });

    if (!wish) {
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    }

    return wish;
  }

  async update(id, data) {
    return await this.wishRepository.update(id, data);
  }
}
