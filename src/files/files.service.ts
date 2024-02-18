import { Injectable, NotFoundException } from '@nestjs/common';
const { unlink } = require('node:fs/promises');

@Injectable()
export class FilesService {
  uploadImage(file: Express.Multer.File) {
    return { fileUploaded: file.filename };
  }
  async deleteImage(fileName: string, type: string) {
    const path = process.cwd() + `\\public\\images\\${type}\\${fileName}`;
    try {
      await unlink(path);
      return `Delete image ${fileName} successfully`
    } catch (error) {
      if (error.code === 'ENOENT')
        throw new NotFoundException(`Not found image with the name ${fileName}`);
      else throw error;
    }
  }
}
