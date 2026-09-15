import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage =  new multer.diskStorage({
  destination: function(req, file, cb){
    cb (null, './src/public/temp')
  },
  filename: function (req, file, cb){
    cb(null,file.originalname);
  }
});

const upload = multer({ storage: storage });

export {upload,cloudinary}