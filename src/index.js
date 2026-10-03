import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import dbConnect from "./config/db.js";

dbConnect();







const port = Number(process.env.PORT) || 3000

app.listen(port,()=>{
    console.log(`server is running at port ${port}`)
})

