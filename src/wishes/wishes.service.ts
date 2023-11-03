import { Injectable } from '@nestjs/common';
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
}
