import express from 'express'
import { createCourse, deleteCourse, getCourses } from '../controllers/courseContolller.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/createCourse',verifyAdmin, createCourse);
router.delete('/deleteCourse/:courseId', verifyAdmin, deleteCourse);

export default router;