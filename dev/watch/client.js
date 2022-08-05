const chokidar = require("chokidar");
const { spawn } = require("child_process");

const watcher = chokidar.watch([], {
  ignored: /(^|[/\\])\../, // ignore dotfiles,
  persistent: true,
  cwd: ".",
});

// eslint-disable-next-line no-console
const log = console.log.bind(console);

// This lets us ensure we are only running 1 build process
// at a time. We use a isRunning lock to kill a previous build
// if a new build is triggered by the watcher events.
//
// This is also rate limited by a setTimeout limiter that prevents
// this from un-necessarily being triggered multiple times by file
// events. This should keep you always building the newest version
// of the code as little as possible within a couple seconds after
// you have saved/changed a file.
let buildProc = null;
let isRunning = false;
const buildAction = () => {
  if (isRunning && buildProc) {
    log("new changes detected during a build, restarting build...");
    buildProc.kill("SIGINT");
  }

  isRunning = true;
  buildProc = spawn("npm", ["run", "build:client"]);

  buildProc.stdout.on("data", (data) => {
    log(data.toString());
  });

  buildProc.stderr.on("data", (data) => {
    log(data.toString());
  });

  buildProc.on("close", (code) => {
    log(`build process exited with code ${code}`);
    isRunning = false;
  });
};

// This lets us process all the file updates for up to 1.5 seconds before
// we trigger a new build. This prevents the modification of many files in
// succession from causing more than 1 build to trigger.
let buildClientTimeout = null;
const buildClient = () => {
  if (buildClientTimeout !== null && buildClientTimeout !== undefined) {
    clearTimeout(buildClientTimeout);
  }

  buildClientTimeout = setTimeout(buildAction, 1500);
};

// Set up the actual watcher
watcher
  .on("add", (path) => {
    log(`File ${path} is being watched`);
    buildClient();
  })
  .on("change", (path) => {
    log(`File ${path} has been changed`);
    buildClient();
  })
  .on("unlink", (path) => {
    log(`File ${path} has been removed`);
    buildClient();
  })
  .on("ready", (path) => `Initial scan complete. Now watching for changes.`);

watcher.add([
  "src/core/client/**",
  "src/core/common/**",
  "src/locales/**",
  "src/types/**",
  // Watch the server schema types in case they change; if they do,
  // we know the schema has also changed
  "src/core/server/graph/schema/__generated__/**",
]);

// Log out what is being watched
const watchedPaths = watcher.getWatched();
log(watchedPaths);
