import express from 'express'
import { createCourse, deleteCourse } from '../controllers/courseContolller.js';

const router = express.Router();

router.post('/createCourse', createCourse);
router.delete('/deleteCourse/:courseId', deleteCourse);

export default router;