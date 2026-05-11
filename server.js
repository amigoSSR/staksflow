require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const helmet     = require('helmet');
const compression = require('compression');
const rateLimit  = require('express-rate-limit');
const morgan     = require('morgan');
const { Server } = require('socket.io');

const authRouter      = require('./routes/auth');
const tasksRouter     = require('./routes/tasks');
const adminRouter     = require('./routes/admin');
const communityRouter = require('./routes/community');

const app  = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// ── Security Headers (Helmet) ─────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      styleSrc:    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc:     ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      imgSrc:      ["'self'", "data:", "blob:"],
      connectSrc:  ["'self'", "ws:", "wss:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: isProd ? allowedOrigins : '*',
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
app.use('/api/auth/login',    authLimiter);
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
app.use('/api/auth',      authRouter);
app.use('/api/tasks',     tasksRouter);
app.use('/api/admin',     adminRouter);
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
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint tidak ditemukan' });
  }
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
const server = app.listen(PORT, () => {
  console.log(`\n🚀 STAKS FLOW [${process.env.NODE_ENV || 'development'}] running at http://localhost:${PORT}`);
  console.log(`🔐 Auth  → http://localhost:${PORT}/api/auth`);
  console.log(`📋 Tasks → http://localhost:${PORT}/api/tasks`);
  console.log(`🏘️  Comm  → http://localhost:${PORT}/api/community`);
  console.log(`❤️  Health→ http://localhost:${PORT}/api/health\n`);
});

// ── Socket.IO ─────────────────────────────────────────────────────────────────
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
process.on('SIGINT',  shutdown);
