import mongoose from "mongoose";

const questionPaperSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Paper title is required"],
        trim:true,
    },
    subjectCode: {
        type:String,
        required:true,
        uppercase:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },
    semester:{
        type:Number,
        required:true,
        min:1,
        max:8,
    },
    year:{
        type:Number,
        required:true,
    },
    pdfDetails:{
        url:{
            type:String,
            required:true,
        }
    },
    publicId:{
        type:String,
        required:true,
    },
    fileSize:{
        type:String,
    },
    uploadedBy:{
        type:String,
        default:"Admin",
    },

},{timestamps:true});


questionPaperSchema.index({course:1, semester:1, year:-1});

export default mongoose.model("QuestionPaper", questionPaperSchema);