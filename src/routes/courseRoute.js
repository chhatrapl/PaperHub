import express from 'express'
import { createCourse, deleteCourse, getCourses } from '../controllers/courseContolller.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/createCourse', createCourse);
router.delete('/deleteCourse/:courseId', deleteCourse);

export default router;