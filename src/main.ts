import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import 'express-async-errors';

import userRouter from './modules/auth/auth.routes';

dotenv.config(); 
connectDB(); 

const app: Application = express();

app.use(cors());
app.use(express.json());

/** All API Routes */
app.use('/api/v1/auth', userRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    res.status(500).json({ error: error.message });
});
  

const startServer = (port: string | number) => {
    try {
        app.listen(port, (): void => {
            console.log(`Server started on port ${port}`)
        })
    } catch (error) {
        console.error(`
            Error occured while starting server: ${error}
        `)
        process.exit(1);
    }
}

startServer(process.env.PORT! || 8000);