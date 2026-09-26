import express from 'express';
import { upload } from '../middleware/cloudinary.js';
import {
	deleteQuestionPaper,
	getQuestionPapers,
	uploadQuestionPaper,
} from '../controllers/questionPaperController.js';

const router = express.Router();

router.get('/course/:courseCode/semester/:semester', getQuestionPapers);
router.post('/upload', upload.single('pdf'), uploadQuestionPaper);
router.delete('/:questionPaperId', deleteQuestionPaper);

export default router;
