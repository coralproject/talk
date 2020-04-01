// Apply all the configuration provided in the .env file.
require("dotenv").config();

module.exports = {
  title: "Coral 5",
  src: "./src",
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.DOCZ_PORT, 10) || 3030,
  files: "**/*.mdx",
};
