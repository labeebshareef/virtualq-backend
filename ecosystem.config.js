'use strict';

module.exports = {
  apps: [{
    name: 'virtualq',
    script: 'app.js',
    watch: true,
    ignore_watch: ['.git', 'node_modules', 'logs', 'package-lock.json'],
    max_memory_restart: '1G',
    autorestart: true,
    env: {
      NODE_ENV: 'development',
      PORT: '3000',
      DB_URI: 'mongodb://virtualQAdmin:adminvirtualQ' +
      '@localhost:27017/virtualq?authSource=admin',
      SMTP_HOST: 'smtp-relay.sendinblue.com',
      SMTP_PORT: 587,
      SMTP_USER: 'labeebshareef96@gmail.com',
      SMTP_PASSWORD: 'xsmtpsib-819ea7dd62c64a8a52abf9e715a7cf2b8c4d3962572b2b' +
      'c4b36e9f102f70d14b-F9DVyCPMwcTvrtY5',
      MAIL_SENDER: 'virtualQ Team <info@virtualq.com>',
      FCM_SERVER_KEY: 'AAAAS2SwywM:APA91bG3fAxcZS_dvcrMJNecJIvSSoNtvztQWreu6c' +
      'PtQgATkCEiXOgiEbJYFTz5fXBF1aEE3_HYyLjajCm4rnQNYrbVL8nCyQmk4wSB2fpiogic' +
      'IcetqFsz4pdTtdMafwkq1V5UvGNo ',
    },
  }],
};
