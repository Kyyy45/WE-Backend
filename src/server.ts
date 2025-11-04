import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import { logger } from './utils/logger';

const PORT = Number(process.env.PORT || 5000);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));
  } catch (err) {
    logger.error('Startup error: ' + (err as Error).message);
    process.exit(1);
  }
})();
