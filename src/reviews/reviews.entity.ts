import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { CURRENT_TIMESTAMP } from '../util/constants';
import { User } from 'src/users/user.entity';
@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'varchar' })
  comment!: string;

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

  @ManyToOne(() => Product, (product) => product.Reviews)
  product!: Product;

  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  user!: User;
}
