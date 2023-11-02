import { IsEmail } from 'class-validator';

export class QueryUserDto {
  @IsEmail()
  email: string;
}
