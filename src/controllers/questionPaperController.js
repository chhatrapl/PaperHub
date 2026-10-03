import fs from "fs";
import path from "path";
import Course from "../models/course.js";
import mongoose from "mongoose";
import QuestionPaper from "../models/questionPaper.js";
import {
    deleteQuestionPaperFile,
    deleteSupabaseQuestionPaperFile,
    uploadQuestionPaperFile,
} from "../services/questionPaperStorage.js";

function cleanupTempFile(filePath) {
    if (!filePath) return;

    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Temp file cleanup failed:", error.message);
        }
    }
}

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

        try {
            await deleteQuestionPaperFile(questionPaper);
        } catch (error) {
            return res.status(502).json({
                success: false,
                message: error.message,
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
    let uploadedStoragePath;
    const filePath = req.file?.path;

    try {
        const { title, subjectCode, courseCode, semester, year, uploadedBy } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file",
            });
        }

        if (!title || !subjectCode || !courseCode || !semester || !year) {
            cleanupTempFile(filePath);
            return res.status(400).json({
                success: false,
                message: "title, subjectCode, courseCode, semester and year are required",
            });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();

        if (ext !== ".pdf") {
            cleanupTempFile(filePath);
            return res.status(400).json({
                success: false,
                message: "Only PDF files are allowed",
            });
        }

        const course = await Course.findOne({ code: courseCode.trim().toUpperCase() });

        if (!course) {
            cleanupTempFile(filePath);
            return res.status(404).json({
                success: false,
                message: "Course not found for the provided courseCode",
            });
        }

        const uploadResult = await uploadQuestionPaperFile(filePath, course._id, semester);
        uploadedStoragePath = uploadResult.storagePath;

        const questionPaper = await QuestionPaper.create({
            title,
            subjectCode,
            course: course._id,
            semester,
            year,
            pdfDetails: {
                url: uploadResult.url,
            },
            storagePath: uploadResult.storagePath,
            fileSize: req.file.size ? `${req.file.size}` : "0",
            uploadedBy: uploadedBy || "Admin",
        });

        uploadedStoragePath = null;
        cleanupTempFile(filePath);

        return res.status(201).json({
            success: true,
            message: "Question paper uploaded successfully",
            data: questionPaper,
        });
    } catch (error) {
        if (uploadedStoragePath) {
            try {
                await deleteSupabaseQuestionPaperFile(uploadedStoragePath);
            } catch (cleanupError) {
                console.error("Supabase upload cleanup failed:", cleanupError.message);
            }
        }
        cleanupTempFile(filePath);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

