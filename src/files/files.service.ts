import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  uploadImage(file: Express.Multer.File) {
    return { fileUploaded: file.filename };
  }
}
