module.exports = {
  apps: [
    {
      name: 'crm-web',
      script: 'app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
};
