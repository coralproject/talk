module.exports = {
  apps: [
    {
      name: "Talk",
      script: "./dist/index.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
