import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/uploads')
export class UploadsController {
  public constructor(private readonly config: ConfigService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public UploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file is not found !');
    }

    return `the file name is ${file.filename} uploaded successfully`;
  }

  @Get(':filename')
  public showUploadedFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): void {
    res.sendFile(filename, { root: './images' });
  }
}
