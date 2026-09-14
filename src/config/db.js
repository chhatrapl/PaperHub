import mongoose from "mongoose"

const dbConnect = async ()=>{
     try {
        const db_connect = await mongoose.connect(process.env.db_url);
        console.log(`mongodb connected at ${db_connect.connection.host}`)
     } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
     }
     };
  

     export default dbConnect;
