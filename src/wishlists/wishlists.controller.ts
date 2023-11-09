import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { IWishlistAndOwnerAndItems } from 'src/types/types';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async findAll(): Promise<IWishlistAndOwnerAndItems[]> {
    return await this.wishlistsService.find();
  }

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() { user: { id } },
  ): Promise<IWishlistAndOwnerAndItems> {
    return await this.wishlistsService.create(createWishlistDto, id);
  }

  @Get(':id')
  async findById(@Param('id') id): Promise<IWishlistAndOwnerAndItems | Error> {
    return await this.wishlistsService.findById(id);
  }

  @Patch(':id')
  async updateWishlist(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() { user: { id } },
    @Param('id') paramId,
  ): Promise<IWishlistAndOwnerAndItems | Error> {
    return await this.wishlistsService.updateWishlist(
      updateWishlistDto,
      id,
      paramId,
    );
  }

  @Delete(':id')
  async deleteWishlist(
    @Req() { user: { id } },
    @Param('id') paramId,
  ): Promise<IWishlistAndOwnerAndItems | Error> {
    return await this.wishlistsService.deleteWishlist(id, paramId);
  }
}
