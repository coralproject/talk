import fs from "fs";
import path from "path";

let revision: string = "";
let version: string = "";

// Pull the version information from the package.json file.
const packagePath = path.join(__dirname, "..", "..", "..", "package.json");
({ version } = JSON.parse(fs.readFileSync(packagePath, "utf8")));

// Try to get the revision from the revision file. This file is generated by the
// Docker build.
const revisionPath = path.join(__dirname, "__generated__", "revision.json");
if (fs.existsSync(revisionPath)) {
  ({ revision } = JSON.parse(fs.readFileSync(revisionPath, "utf8")));
}
