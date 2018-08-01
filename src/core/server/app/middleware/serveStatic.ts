import serveStatic from "express-static-gzip";
import path from "path";

export default serveStatic(path.join(__dirname, "..", "..", "dist"), {});
