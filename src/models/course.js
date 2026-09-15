import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
        trim:true
    },
    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
    },
    totalSemesters:{
        type:Number,
        required:true,
        default:6,
    },
},
{timestamps:true}
);

export default mongoose.model("Course", courseSchema);