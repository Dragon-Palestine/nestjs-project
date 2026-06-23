import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP } from '../util/constants';
import { UserType } from '../util/enums';
import { Product } from '../products/product.entity';
import { Review } from '../reviews/reviews.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  userName!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
  role!: UserType;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ nullable: true, default: null })
  profileImage!: string;

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

  @OneToMany(() => Product, (product) => product.user)
  products!: Product[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];
}
