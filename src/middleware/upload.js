import multer from 'multer';

const storage = new multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/temp');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export { upload };