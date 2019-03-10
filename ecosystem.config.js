module.exports = {
  apps: [
    {
      name: 'crm_web',
      script: 'app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
};
