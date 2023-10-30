import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsNumber()
  raised: number;

  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  copied: number;
}
