import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import healthRouter from './routes/health.js';
import linksRouter from './routes/links.js';
import redirectRouter from './routes/redirect.js';

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: env.CORS_ORIGIN || '*', credentials: false }));
// app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

// Health check
app.use('/healthz', healthRouter);

// API routes
app.use('/api/links', linksRouter);

// Redirect route must come after API routes
app.use('/', redirectRouter);

// 404 handler for API
app.use('/api', notFound);

// Error handler
app.use(errorHandler);

export default app;
