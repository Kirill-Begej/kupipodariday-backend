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
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

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
    return await this.wishesService.findSortWishes({ createdAt: 'DESC' }, 40);
  }

  @Get('top')
  async findTopWishes() {
    return await this.wishesService.findSortWishes({ copied: 'DESC' }, 20);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findWish(@Param('id') paramId, @Req() { user: { id } }) {
    return await this.wishesService.findWish(paramId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Body() updateWishDto: UpdateWishDto,
    @Param('id') paramId,
    @Req() { user: { id } },
  ) {
    return await this.wishesService.updateWish(updateWishDto, paramId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') paramId, @Req() { user: { id } }) {
    return await this.wishesService.deleteWish(paramId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@Param('id') paramId, @Req() { user: { id } }) {
    return await this.wishesService.copyWish(paramId, id);
  }
}
