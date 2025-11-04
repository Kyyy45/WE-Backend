import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import { logger } from './utils/logger';
import http from 'http';

const PORT = Number(process.env.PORT || 5000);

let server: http.Server;

(async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));
  } catch (err) {
    logger.error('Startup error: ' + (err as Error).message);
    process.exit(1);
  }
})();


/**
 * Menangkap Promise error yang tidak ditangani (unhandledRejection).
 * Contoh: Koneksi database terputus, 3rd party API gagal tanpa .catch()
 */
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Menutup server...');
  logger.error(err.name + ': ' + err.message);
  
  // Beri waktu 10 detik untuk menyelesaikan request yang sedang berjalan
  if (server) {
    server.close(() => {
      logger.info('Server ditutup. Proses dihentikan.');
      process.exit(1);
    });
  } else {
    // Jika server belum sempat berjalan
    process.exit(1);
  }
});

/**
 * Menangkap error sinkronus yang tidak ditangani (uncaughtException).
 * Contoh: const a = {}; a.b.c(); (bug dalam kode)
 */
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Menutup server...');
  logger.error(err.name + ': ' + err.message);
  
  if (server) {
    server.close(() => {
      logger.info('Server ditutup. Proses dihentikan.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});