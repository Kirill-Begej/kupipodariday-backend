import {
  Body,
  Controller,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { IUser } from 'src/types/types';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUser | HttpException> {
    return this.usersService.create(createUserDto);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req: Request & { user: User },
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
}
