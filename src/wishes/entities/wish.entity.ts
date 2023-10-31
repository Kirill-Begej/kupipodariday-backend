import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({
    type: 'numeric',
    precision: 1000,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'numeric',
    precision: 1000,
    scale: 2,
  })
  raised: number;

  @Column({ default: '' })
  description: string;

  @Column({ default: 0 })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn({ name: 'owner' })
  owner: User;
}
