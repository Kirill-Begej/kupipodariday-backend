import { Column, Entity, ManyToOne } from 'typeorm';
import { IsBoolean, IsNumber } from 'class-validator';
import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'float' })
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
