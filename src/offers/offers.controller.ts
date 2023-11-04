import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Req() { user: { id } }) {
    return await this.offersService.create(createOfferDto, id);
  }
}
