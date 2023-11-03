import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() { user: { id } },
  ) {
    return this.wishlistsService.create(createWishlistDto, id);
  }

  @Get()
  async findAll() {
    return await this.wishlistsService.findAll();
  }
}
