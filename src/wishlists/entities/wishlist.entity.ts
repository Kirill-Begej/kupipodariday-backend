import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/entities/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.id)
  @JoinTable({
    name: 'wishlist_wish',
    joinColumn: {
      name: "wishlistId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "wishId",
      referencedColumnName: "id"
    }
  })
  items: Wish[];
}
