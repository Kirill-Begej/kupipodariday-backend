import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishDto } from './dto/create-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createWishDto: CreateWishDto, @Req() { user: { id } }) {
    return this.wishesService.create(createWishDto, id);
  }

  @Get('last')
  async findLastWishes() {
    return await this.wishesService.findSortWishes({createdAt: 'DESC'}, 40);
  }

  @Get('top')
  async findTopWishes() {
    return await this.wishesService.findSortWishes({copied: 'DESC'}, 20);
  }

  @Get(':id')
  async findWish(@Param('id') paramId) {
    return await this.wishesService.findWish(paramId);
  }
}
