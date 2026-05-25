require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { Server } = require('socket.io');
const cron = require('node-cron');
const weeklyReportService = require('./services/weeklyReportService');

const authRouter = require('./routes/auth');
const diariesRouter = require('./routes/diaries');
const adminRouter = require('./routes/admin');
const communityRouter = require('./routes/community');
const projectsRouter = require('./routes/projects');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// ── Security Headers (Helmet) ─────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      frameSrc: ["'self'", "blob:"],
      objectSrc: ["'self'", "blob:"],
      connectSrc: ["'self'", "ws:", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      upgradeInsecureRequests: null, // PENTING: Jangan paksa upgrade ke HTTPS
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: false, // Matikan HSTS karena aplikasi belum menggunakan SSL/HTTPS (mencegah ERR_SSL_PROTOCOL_ERROR)
}));

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:3010', 'http://178.128.109.116:3010', 'http://178.128.109.116:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (isProd) {
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Terlalu banyak request. Coba lagi nanti.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ── HTTP Logging ──────────────────────────────────────────────────────────────
app.use(morgan(isProd ? 'combined' : 'dev'));

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: isProd ? '7d' : 0,
  etag: true,
}));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/diaries', diariesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/manual', require('./routes/manual'));
app.use('/api/community', communityRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'STAKS FLOW',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's',
  });
});

// ── SPA Fallback ──────────────────────────────────────────────────────────────
// Only serve index.html for routes without file extensions (true SPA routes).
// Static files (.html, .css, .js, .png, etc.) are handled by express.static above.
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint tidak ditemukan' });
  }
  // Let static middleware handle .html/.css/.js/.png paths; only SPA routes fall here
  const hasExtension = /\.[a-zA-Z0-9]+$/.test(req.path);
  if (hasExtension) {
    return res.status(404).send('File tidak ditemukan');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: isProd ? 'Terjadi kesalahan pada server' : err.message,
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
// ── Export for Vercel ────────────────────────────────────────────────────────
module.exports = app;

// Only listen if not running in production (Vercel)
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 STAKS FLOW [${process.env.NODE_ENV || 'development'}] running at http://localhost:${PORT}`);
    console.log(`🔐 Auth  → http://localhost:${PORT}/api/auth`);
    console.log(`📋 Diaries → http://localhost:${PORT}/api/diaries`);
    console.log(`🏘️  Comm  → http://localhost:${PORT}/api/community`);
    console.log(`❤️  Health→ http://localhost:${PORT}/api/health\n`);
  });

  // Socket.IO
  const io = new Server(server, {
    cors: {
      origin: isProd ? allowedOrigins : '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    socket.on('join_admin', () => {
      socket.join('admin_room');
    });
    socket.on('disconnect', () => {
      // cleanup if needed
    });
  });

  // ── Weekly automated report generation at 01:00 WIB every Monday ─────────────
  cron.schedule('0 1 * * 1', async () => {
    const ts = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    console.log(`\n⏱️  [${ts}] Auto-generating weekly reports...`);
    try {
      const result = await weeklyReportService.generateWeeklyReports();
      console.log(`✅ Weekly reports auto-generated: ${result.created_count} file(s) for period ${result.period}\n`);
    } catch (err) {
      console.error('❌ Weekly report auto-generation failed:', err.message);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  });

  // Log next scheduled run on startup
  (function logNextCronRun() {
    const now = new Date();
    // Find next Monday 01:00 WIB
    const jakartaNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const daysUntilMon = (1 - jakartaNow.getDay() + 7) % 7 || 7;
    const nextMon = new Date(jakartaNow);
    nextMon.setDate(jakartaNow.getDate() + daysUntilMon);
    nextMon.setHours(1, 0, 0, 0);
    console.log(`📅 Weekly report auto-gen scheduled: every Monday 01:00 WIB`);
    console.log(`   Next run ≈ ${nextMon.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 01:00 WIB\n`);
  })();

  // ── Handle Port Conflict ──────────────────────────────────────────────────────
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} sudah dipakai.`);
      console.error(`   Jalankan: kill $(lsof -t -i:${PORT})\n`);
      process.exit(1);
    } else {
      throw err;
    }
  });

  // ── Graceful Shutdown ─────────────────────────────────────────────────────────
  const shutdown = () => {
    console.log('\n🛑 Shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed.');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
