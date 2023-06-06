import noteRoutes from "./routes/note.routes";

require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import config from 'config';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { AppDataSource } from './utils/data-source';
import AppError from './utils/appError';
import validateEnv from './utils/validateEnv';
// import redisClient from './utils/connectRedis';
import sls from "serverless-http"

AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // TEMPLATE ENGINE

    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: '10kb' }));

    // 2. Logger
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

    // 3. Cookie Parser
    app.use(cookieParser());

    // 4. use static file (optional)
    app.use(express.static('public'))

    // 5. Cors
    app.use(
      cors({
        origin: '*',
        credentials: true,
      })
    );

    // ROUTES
    app.use('/api/notes', noteRoutes);

    // HEALTH CHECKER
    app.get('/api/health-checker', async (_, res: Response) => {
      // const message = await redisClient.get('try');

      res.status(200).json({
        status: 'success',
        // message,
      });
    });

    // UNHANDLED ROUTE
    app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || 'error';
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );

    const port = config.get<number>('port');
    app.listen(port);

    console.log(`Server started on port: ${port}`);

    module.exports.server = sls(app);
  })
  .catch((error) => console.log(error));
