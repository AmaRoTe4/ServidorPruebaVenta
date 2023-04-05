import express from "express";
import cors from "cors";
import router from "./src/routes/routes.js";
import * as dotenv from 'dotenv'
import google from '@google-cloud/debug-agent';

google.start({serviceContext: {enableCanary: false}})
dotenv.config()

const app = express();

app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/Api' , router);

app.get('/', (_req, res)=>{
    res.send("running")
})

app.listen(process.env.PORT ,() => {
    console.log(`listening on port ${process.env.PORT}`)
})
