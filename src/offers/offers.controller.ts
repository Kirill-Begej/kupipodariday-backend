import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { IOffersAndItemAndUser } from 'src/types/types';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() { user: { id } }: Request & { user: User },
  ): Promise<object | Error> {
    return await this.offersService.create(createOfferDto, id);
  }

  @Get()
  async findOffers(): Promise<
    IOffersAndItemAndUser | IOffersAndItemAndUser[] | Error
  > {
    return await this.offersService.find();
  }

  @Get(':id')
  async findOffer(
    @Param('id') id: number,
  ): Promise<IOffersAndItemAndUser | IOffersAndItemAndUser[] | Error> {
    return await this.offersService.find(id);
  }
}
