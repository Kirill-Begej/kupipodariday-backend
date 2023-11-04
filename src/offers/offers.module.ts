import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish]), UsersModule, WishesModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
