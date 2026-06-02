import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import teamRouter from './routes/team.routes.js';
import aiJudgeRouter from './routes/aiJudge.routes.js';

const app=express();
app.use(morgan("dev"))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/team",teamRouter)
app.use("/api/ai-judge",aiJudgeRouter)

export default app