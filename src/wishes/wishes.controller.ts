import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishDto } from './dto/create-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() { user: { id } }) {
    return this.wishesService.create(createWishDto, id);
  }
}
