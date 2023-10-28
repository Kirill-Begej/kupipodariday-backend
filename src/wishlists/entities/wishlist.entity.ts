import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { IsString, IsUrl, Length, MaxLength } from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column({ default: '' })
  @MaxLength(1500)
  @IsString()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
