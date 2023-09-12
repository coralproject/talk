const fs = require("fs");
const path = require("path");
const createConfig = require("./client.baseConfig");

const dir = "./src/core/client";
const dirItems = fs.readdirSync(dir);
let roots = [];

const excludedRoots = ["src/core/client/stream", "src/core/client/admin"];

for (const item of dirItems) {
  const fullPath = path.join(dir, item);
  const stats = fs.statSync(fullPath);
  if (stats.isDirectory() && !excludedRoots.includes(fullPath)) {
    roots.push(fullPath);
  }
}

roots = roots.map((r) => `<rootDir>/${r}`);

const baseConfig = createConfig();

module.exports = {
  ...baseConfig,
  displayName: "client:other",
  roots,
};
