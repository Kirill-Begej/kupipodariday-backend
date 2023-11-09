import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  IUser,
  IWishAndOwnerAndOffers,
  IWishFindByUsername,
} from 'src/types/types';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findMe(@Req() { user: { id } }): Promise<IUser> {
    return this.usersService.find({ id }, false);
  }

  @Patch('me')
  async updateUser(
    @Req() { user: { id } },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Get('me/wishes')
  async findCurrentUserWishes(
    @Req() { user: { id } },
  ): Promise<IWishAndOwnerAndOffers[]> {
    return await this.usersService.findWishes(id);
  }

  @Get(':username')
  async findAnotherUser(@Param('username') username): Promise<IUser> {
    return await this.usersService.find({ username }, false, false);
  }

  @Get(':username/wishes')
  async findAnotherUserWishes(
    @Param('username') username,
  ): Promise<IWishFindByUsername[]> {
    return await this.usersService.findUserWishes(username);
  }

  @Post('find')
  async findUser(@Body('query') query): Promise<IUser[]> {
    return await this.usersService.findMany(query);
  }
}
