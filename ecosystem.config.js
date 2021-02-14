module.exports = {
  apps: [
    {
      name: 'AuthDeputy',
      script: './bin/www',
      env: {
        NODE_ENV: 'production',
        TZ: 'UTC',
      },
    },
  ],
};
