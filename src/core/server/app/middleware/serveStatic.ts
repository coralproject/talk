import serveStatic from "express-static-gzip";
import path from "path";

const staticPath = path.resolve(
  path.join(__dirname, "..", "..", "..", "..", "..", "dist", "static", "assets")
);

export default serveStatic(staticPath, { index: false });
