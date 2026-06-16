import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
@Module({
  imports: [
    ProductsModule,
    UsersModule,
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '0702',
      database: 'nestjs',
      entities: [Product],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
