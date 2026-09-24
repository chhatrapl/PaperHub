import mongoose from "mongoose";
import course from "../models/course.js";
import QuestionPaper from "../models/questionPaper.js";

const Subject = mongoose.models.Subject;

export const createCourse = async (req, res) => {
    const { courseName, totalSemesters, code } = req.body;

    try {
        if (!courseName || !totalSemesters || !code) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const newCourse = await course.create({
            courseName,
            code,
            totalSemesters,
        });

        console.log("course created");

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        const existingCourse = await course.findById(courseId);

        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        await QuestionPaper.deleteMany({ course: courseId });

      

        const deletedCourse = await course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course and related records deleted successfully",
            data: deletedCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};