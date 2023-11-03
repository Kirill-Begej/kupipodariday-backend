import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  itemsId?: number[];
}
