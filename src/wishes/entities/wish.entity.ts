import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    precision: 1000,
    scale: 2,
  })
  @IsNumber()
  price: number;

  @Column({
    default: 0,
    type: 'numeric',
    precision: 1000,
    scale: 2,
  })
  @IsNumber()
  raised: number;

  @Column({ default: '' })
  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description: string;

  @Column({ default: 0 })
  @IsNumber()
  @IsOptional()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
