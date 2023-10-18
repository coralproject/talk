/* eslint-disable no-console */
const { execSync } = require("child_process");
const sgf = require("staged-git-files");

const projectDir = "server/";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const matchesExtension = (validExtensions, filename) => {
  let matches = false;
  for (const ext of validExtensions) {
    if (filename.endsWith(ext)) {
      matches = true;
    }
  }

  return matches;
};

sgf((err, results) => {
  if (err) {
    console.error("unable to get staged git files");
    console.error(err);
    process.exit(1);
  }

  const eslintFiles = [];
  for (const item of results) {
    const { filename, status } = item;

    // only include valid, filtered extensions
    // this is primarily to keep eslint rampaging
    // over non-source files
    if (!matchesExtension(extensions, filename || status === "Deleted")) {
      continue;
    }

    // only include files within our project directory,
    // the other projects will handle themselves
    if (filename.startsWith(projectDir)) {
      eslintFiles.push(filename.slice(projectDir.length, filename.length));
    }
  }

  const extArgs = extensions.map((e) => `--ext ${e}`).join(" ");

  console.log("linting the following:");
  console.log(eslintFiles);

  console.log("starting lint...");
  execSync(`eslint ${extArgs} ${eslintFiles.join(" ")}`, {
    stdio: "inherit",
  });
});
