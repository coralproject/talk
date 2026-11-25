module.exports = (api) => ({
  presets: [
    [
      "@babel/react",
      {
        runtime: api.env("test") ? "automatic" : "classic",
      },
    ],
  ],
});
