import multer from 'multer';
import path, { extname } from 'path';
import fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const uploadPath = process.cwd() + `\\public\\images\\${req.headers['upload-type']}`;
      await fs.promises.mkdir(uploadPath, {
        recursive: true,
      });
      cb(null, uploadPath);
    } catch (err) {
      throw err;
    }
  },
  filename: function (req, file, cb) {
    const {ext, name} = path.parse(file.originalname)
    const uniqueSuffix = Date.now();
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});
export const multerOptions = {
    // Enable file size limits
    limits: {
        fileSize: 1024000,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            cb(null, true);
        } else {
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    storage: storage,
};