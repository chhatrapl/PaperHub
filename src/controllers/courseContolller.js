import course from "../models/course.js";


export const createCourse = async (req, res)=>{
const {courseName, totalSemesters, code} = req.body;


try {
    if(!courseName || !totalSemesters ||!code){
        return res.status(400).json({
            message:"All Fields Are Required!"
        })
    };
    
    
    const newCourse = await course.create({
        courseName,
        code,
        totalSemesters
    })
    console.log("course created");
    return res.status(200).json({
        success:true,
        message:"course created successfully",
        data:newCourse
    });

   

} catch (error) {
    return res.status(500).json({
        success:false,
        message:error.message
    })
}



}