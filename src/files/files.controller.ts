import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';
import { Message } from '@/decorators/message.decorator';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @Message('Upload an image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFileImage(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadImage(file);
  }
}
