import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
import searchRoutes from './routes/tableRoutes.js'
dotenv.config();
const app = express()

app.use(cors())

//Routes
app.use('/api/v1/search', searchRoutes);

const PORT  =process.env.PORT || 3000;

app.listen(PORT,() =>{
console.log(`Server is listenning on port: `, PORT);
})