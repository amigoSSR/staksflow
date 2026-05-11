// ecosystem.config.js — PM2 Production Config for STAKS FLOW
// Usage:
//   pm2 start ecosystem.config.js
//   pm2 save && pm2 startup

module.exports = {
  apps: [
    {
      name: 'staks-flow',
      script: 'server.js',

      // ── Cluster mode: use all CPU cores ──────────────────────────────────────
      instances: 'max',   // or set to a number, e.g. 2
      exec_mode: 'cluster',

      // ── Environment ───────────────────────────────────────────────────────────
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // ── Auto Restart ──────────────────────────────────────────────────────────
      watch: false,                    // disable file watch in production
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,            // ms between restarts

      // ── Memory / CPU Limits ───────────────────────────────────────────────────
      max_memory_restart: '512M',

      // ── Logging ───────────────────────────────────────────────────────────────
      output: './logs/pm2-out.log',
      error:  './logs/pm2-err.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      log_type: 'json',

      // ── Graceful Shutdown ─────────────────────────────────────────────────────
      kill_timeout: 10000,            // wait 10s before force kill
      listen_timeout: 8000,           // wait for app to start

      // ── Source Map ────────────────────────────────────────────────────────────
      source_map_support: false,
    },
  ],
};
