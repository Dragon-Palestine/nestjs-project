import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  // injecting user module and product entity to usining thwm incide products controller
  imports: [UsersModule, TypeOrmModule.forFeature([Product]), JwtModule],
  exports: [ProductsService],
})
export class ProductsModule {}
