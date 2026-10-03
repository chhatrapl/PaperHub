import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { supabase, questionPapersBucket } from "../config/supabase.js";

function getQuestionPapersBucket() {
    if (!questionPapersBucket) {
        throw new Error("SUPABASE_STORAGE_BUCKET is not configured");
    }

    return supabase.storage.from(questionPapersBucket);
}

export async function uploadQuestionPaperFile(filePath, courseId, semester) {
    const storagePath = `${courseId}/${semester}/${randomUUID()}.pdf`;
    const fileBuffer = await fs.readFile(filePath);
    const { error } = await getQuestionPapersBucket().upload(storagePath, fileBuffer, {
        contentType: "application/pdf",
        upsert: false,
    });

    if (error) {
        throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const { data } = getQuestionPapersBucket().getPublicUrl(storagePath);

    return {
        storagePath,
        url: data.publicUrl,
    };
}

export async function deleteSupabaseQuestionPaperFile(storagePath) {
    if (!storagePath) {
        throw new Error("Supabase storage path is missing");
    }

    const { error } = await getQuestionPapersBucket().remove([storagePath]);

    if (error) {
        throw new Error(`Supabase delete failed: ${error.message}`);
    }
}

export async function deleteQuestionPaperFile(questionPaper) {
    if (!questionPaper.storagePath) {
        return;
    }

    return deleteSupabaseQuestionPaperFile(questionPaper.storagePath);
}