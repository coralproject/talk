const path = require("path");
const json = require("comment-json");
const fs = require("fs");
const del = require("del");
const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const generateTypescriptTypes = require("./scripts/generateSchemaTypes");
const _ = require("lodash");

// Parse the tsconfig.json file (which contains comments).
const tsconfig = json.parse(fs.readFileSync("./src/tsconfig.json").toString());

// Create the typescript project.
const tsProject = ts.createProject("./src/tsconfig.json");

const resolveDistFolder = (...paths) => "./" + path.join("dist", ...paths);

gulp.task("clean", () => del([resolveDistFolder()]));

gulp.task("server:schema", () => generateTypescriptTypes());

gulp.task("server:scripts", () =>
  gulp
    .src(
      [
        "./src/**/*.ts",
        "./src/**/.*.ts",
        // Exclude client files from this, that's for webpack.
        "!./src/core/client/**/*.ts",
        "!./src/core/client/**/.*.ts",
      ],
      { base: "src" }
    )
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(
      babel({
        plugins: [
          [
            "module-resolver",
            {
              root: [resolveDistFolder()],
              alias: _.reduce(
                tsconfig.compilerOptions.paths,
                (alias, [pathGlob], prefixBlob) => ({
                  ...alias,
                  [prefixBlob.replace(/\/\*/g, "")]: pathGlob
                    .replace(/\/\*/g, "")
                    .replace(/^\./g, resolveDistFolder()),
                }),
                {}
              ),
            },
          ],
        ],
      })
    )
    .pipe(sourcemaps.write(".", { sourceRoot: "../src" }))
    .pipe(gulp.dest(resolveDistFolder()))
);

gulp.task("server:static", () =>
  gulp
    .src(["./src/core/server/**/*", "!./src/core/server/**/*.ts"])
    .pipe(gulp.dest(resolveDistFolder() + "/core/server"))
);

gulp.task("locales", () =>
  gulp
    .src(["./src/locales/**/*"])
    .pipe(gulp.dest(resolveDistFolder() + "/locales"))
);

gulp.task(
  "server",
  gulp.series(
    "server:schema",
    gulp.parallel("server:scripts", "server:static", "locales")
  )
);

gulp.task("default", gulp.series("clean", "server"));
