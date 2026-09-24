import express from 'express'
import { createCourse } from '../controllers/courseContolller.js';

const router = express.Router();

router.post('/createCourse',createCourse);


export default router;