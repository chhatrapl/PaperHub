import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import multer from 'multer';

const tempDirectory = fileURLToPath(new URL('../public/temp/', import.meta.url))
fs.mkdirSync(tempDirectory, { recursive: true })

const storage = new multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export { upload };