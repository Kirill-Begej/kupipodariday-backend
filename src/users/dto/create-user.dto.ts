import { IsEmail, IsOptional, IsString, IsUrl, Length, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 30)
  password: string;
}
