import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    ProductsModule,
    UsersModule,
    ReviewsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        database: config.get<string>('DB_DATABASE'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        port: config.get<number>('DB_PORT'),
        host: config.get<string>('DB_HOST'),
        entities: [Product],
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
