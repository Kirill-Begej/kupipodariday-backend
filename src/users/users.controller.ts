import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUser(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
