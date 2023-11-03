import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/entities/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  name: string;

  @Column()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.id)
  @JoinTable({
    name: 'wishlist_wish',
    joinColumn: {
      name: 'wishlistId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'wishId',
      referencedColumnName: 'id',
    },
  })
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
