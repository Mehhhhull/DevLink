import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import teamRouter from './routes/team.routes.js';
import aiJudgeRouter from './routes/ai-judge.routes.js';


const app = express();
app.use(morgan('dev'));

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/team', teamRouter);
app.use('/api/ai-judge', aiJudgeRouter);

export default app;