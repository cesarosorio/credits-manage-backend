import { extname } from 'path';
import { randomUUID } from 'crypto';

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = randomUUID();
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const paymentImageFileName = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  // Get paymentId from request params
  const paymentId = req.params.id;
  const fileExtName = extname(file.originalname);
  callback(null, `${paymentId}${fileExtName}`);
};

export const destination = './uploads/payments';
