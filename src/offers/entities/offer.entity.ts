import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Offer extends BaseEntity {
  @Column({
    type: 'numeric',
    precision: 1000,
    scale: 2,
  })
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  @Column()
  item: string;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;
}
