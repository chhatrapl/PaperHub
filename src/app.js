import express from "express";
import cors from 'cors'
import courseRoute from './routes/courseRoute.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req, res)=>{
    res.send("server chalu hai ")
})

//course rooute
app.use('/api/v1/course', courseRoute);

export default app;