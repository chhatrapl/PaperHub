import express from 'express';
import { upload } from '../middleware/upload.js';
import {
	deleteQuestionPaper,
	getQuestionPapers,
	uploadQuestionPaper,
} from '../controllers/questionPaperController.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

router.get('/admin/check', verifyAdmin, (req, res) => {
	res.status(200).json({ success: true });
});
router.get('/course/:courseCode/semester/:semester', getQuestionPapers);
router.post('/upload', verifyAdmin, upload.single('pdf'), uploadQuestionPaper);
router.delete('/:questionPaperId', verifyAdmin, deleteQuestionPaper);

export default router;
