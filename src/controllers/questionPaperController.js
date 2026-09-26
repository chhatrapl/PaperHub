import fs from "fs";
import path from "path";
import Course from "../models/course.js";
import mongoose from "mongoose";
import QuestionPaper from "../models/questionPaper.js";
import { cloudinary } from "../middleware/cloudinary.js";

export const getQuestionPapers = async (req, res) => {
    try {
        const { courseCode, semester } = req.params;
        const semesterNumber = Number(semester);

        if (!courseCode || !Number.isInteger(semesterNumber) || semesterNumber < 1) {
            return res.status(400).json({
                success: false,
                message: "A valid courseCode and semester are required",
            });
        }

        const course = await Course.findOne({ code: courseCode.trim().toUpperCase() });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const questionPapers = await QuestionPaper.find()
            .where({ course: course._id, semester: semesterNumber })
            .populate("course", "courseName code")
            .sort({ year: -1, title: 1 });

        return res.status(200).json({
            success: true,
            count: questionPapers.length,
            data: questionPapers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteQuestionPaper = async (req, res) => {
    try {
        const { questionPaperId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(questionPaperId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid question paper ID",
            });
        }

        const questionPaper = await QuestionPaper.findById(questionPaperId);

        if (!questionPaper) {
            return res.status(404).json({
                success: false,
                message: "Question paper not found",
            });
        }

        const cloudinaryResult = await cloudinary.uploader.destroy(questionPaper.publicId, {
            resource_type: "raw",
        });

        if (cloudinaryResult.result !== "ok" && cloudinaryResult.result !== "not found") {
            return res.status(502).json({
                success: false,
                message: "Could not delete the PDF from Cloudinary",
            });
        }

        await QuestionPaper.findByIdAndDelete(questionPaperId);

        return res.status(200).json({
            success: true,
            message: "Question paper deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const uploadQuestionPaper = async (req, res) => {
    try {
        const { title, subjectCode, courseCode, semester, year, uploadedBy } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file",
            });
        }

        if (!title || !subjectCode || !courseCode || !semester || !year) {
            return res.status(400).json({
                success: false,
                message: "title, subjectCode, courseCode, semester and year are required",
            });
        }

        const filePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();

        if (ext !== ".pdf") {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success: false,
                message: "Only PDF files are allowed",
            });
        }

        const course = await Course.findOne({ code: courseCode.trim().toUpperCase() });

        if (!course) {
            fs.unlinkSync(filePath);
            return res.status(404).json({
                success: false,
                message: "Course not found for the provided courseCode",
            });
        }

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "question-papers",
            resource_type: "raw",
            type: "upload",
        });

        if (!uploadResult || !uploadResult.secure_url) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success: false,
                message: "Cloudinary upload failed",
            });
        }

        const questionPaper = await QuestionPaper.create({
            title,
            subjectCode,
            course: course._id,
            semester,
            year,
            pdfDetails: {
                url: uploadResult.secure_url,
            },
            publicId: uploadResult.public_id,
            fileSize: req.file.size ? `${req.file.size}` : "0",
            uploadedBy: uploadedBy || "Admin",
        });

        fs.unlinkSync(filePath);

        return res.status(201).json({
            success: true,
            message: "Question paper uploaded successfully",
            data: questionPaper,
        });
    } catch (error) {
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupErr) {
                console.error("Temp file cleanup failed:", cleanupErr.message);
            }
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

