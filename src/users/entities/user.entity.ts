import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/entities/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];
}
