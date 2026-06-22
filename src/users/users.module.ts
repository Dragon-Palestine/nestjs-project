import { BadRequestException, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from './auth.provider';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthProvider],
  exports: [UsersService],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './images/users',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const filename = `${prefix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg'
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException('invalid file type'), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * Number(process.env.MAX_FILE_SIZE ?? 3),
      }, // 3MB
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') ?? '1d' },
        };
      },
    }),
  ],
})
export class UsersModule {}
