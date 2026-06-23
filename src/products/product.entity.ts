import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CURRENT_TIMESTAMP } from '../util/constants';
import { Review } from '../reviews/reviews.entity';
import { User } from '../users/user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt!: Date;

  @OneToMany(() => Review, (review) => review.product, {
    eager: true,
    onDelete: 'CASCADE',
  })
  Reviews!: Review[];

  @ManyToOne(() => User, (user) => user.products, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user!: User;
}
