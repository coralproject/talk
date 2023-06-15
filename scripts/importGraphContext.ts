/* eslint-disable */
import * as fs from "fs";

const zipWith = <A extends unknown, B extends unknown, C extends unknown>(fn: (a: A, b: B) => C, as: A[], bs: B[]) => {
  const minLen = Math.min(as.length, bs.length);
  return as.slice(0, minLen)
    .map((item, idx) => fn(item, bs[idx]));
}

const files = fs.readdirSync("./src/core/server/graph/resolvers")
  .filter(fileName => fileName.endsWith(".ts"));

const fileContents = files.map(f => fs.readFileSync(`./src/core/server/graph/resolvers/${f}`).toString());

const splitAfterImports = (fString: string) => {
  const lines = fString.split("\n");
  const firstNonImportIdx =
    lines.length -
    lines.slice().reverse()
    .findIndex(ln => !ln.startsWith("import"));

  return [lines.slice(0, firstNonImportIdx), lines.slice(firstNonImportIdx)];
}

const withImports = fileContents
  .map(file => {
    let split = splitAfterImports(file);
    let inserted = [...split[0], `\nimport GraphContext from "../context";\n`, ...split[1]];
    return inserted.join("\n");
  });

const writeJobs = zipWith((fileName, content) => () => fs.writeFileSync(`./src/core/server/graph/resolvers/$TEMP-${fileName}`, content), files, withImports)
writeJobs.forEach(j => j());

