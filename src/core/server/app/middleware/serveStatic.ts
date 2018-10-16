import expressStatic from "express-static-gzip";
import path from "path";

const staticPath = path.resolve(
  path.join(__dirname, "..", "..", "..", "..", "..", "dist", "static", "assets")
);

export const serveStatic = expressStatic(staticPath, { index: false });
