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

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUser(@Req() { user: { id } }) {
    return this.usersService.find({ id }, false);
  }

  @Patch('me')
  async updateUser(
    @Req() { user: { id } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Get(':username')
  async findAnotherUser(@Param('username') username) {
    return await this.usersService.find({ username }, false, false);
  }

  @Post('find')
  async findUser(@Body('query') query) {
    return await this.usersService.findMany(query);
  }
}
