import { IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateWishDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description?: string;
}
