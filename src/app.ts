import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import expressMongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimiter from './middlewares/rateLimiter.middleware';
import authRoutes from './routes/auth.routes';
import errorHandler from './middlewares/error.middleware';
import courseRoutes from "./routes/course.routes";
import courseThumbnailRoutes from "./routes/courseThumbnail.routes";
import dashboardRoutes from './routes/dashboard.routes';
import profileRoutes from './routes/profile.routes';
import enrollmentRoutes from "./routes/enrollment.routes";
import recommendationRoutes from './routes/recommendation.routes';
import transactionRoutes from "./routes/transaction.routes";
import certificateRoutes from "./routes/certificate.routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressMongoSanitize());
app.use(hpp());

app.use(cookieParser());
app.use(morgan('combined'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/v1', rateLimiter);

app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/course-thumbnails", courseThumbnailRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/transactions", transactionRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: `
  .topbar { display: none }
  .swagger-ui .info { margin: 20px; }
  `,
  customSiteTitle: "Worldpedia Education API Docs",
}));

app.use(errorHandler);

export default app;