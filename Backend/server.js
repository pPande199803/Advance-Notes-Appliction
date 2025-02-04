import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import dbConnected from './db/db.connect.js';

// router
import authRouter from "./routers/users.router.js"
import notesRouter from "./routers/notes.router.js"

const app = express();

const PORT = process.env.PORT || 3400;
const uri = process.env.MONGO_URL

app.use(express.json());
app.use(cors());

// database connection
dbConnected(uri)

app.get('/',(req,res)=>{
    res.send('Welcome on Adv-Notes Server..')
})

app.use('/api/v1', authRouter)
app.use('/api/v1', notesRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on port - ${PORT}`)
})