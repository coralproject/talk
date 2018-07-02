import watchman from "fb-watchman";
import chokidar, { WatchOptions } from "chokidar";
import chalk from "chalk";
import path from "path";
import spawn from "cross-spawn";
var log = console.log.bind(console);

// path to watch
const dir = path.resolve(__dirname, "./src");

// this performs a capability checks returning a promise if watchman is available in the system
function capabilityCheck(client: watchman.Client) {
  return new Promise((resolve, reject) => {
    client.capabilityCheck(
      { optional: [], required: ["relative_root"] },
      (error, resp) => {
        if (error) {
          log(chalk.red(`Error in the capability check: ${error}`));
          client.end();
          reject(error);
        }
        resolve({ client, resp });
      }
    );
  });
}

// initializes a watchman client
function initializeWatchmanClient(
  opts?: watchman.ClientOptions
): watchman.Client {
  return new watchman.Client(opts);
}

// initializes a chokidar watcher client {
function inializeChokidarClient(opts?: WatchOptions) {
  return chokidar.watch(["**/*.ts", "**/*.tsx"], opts);
}

// main init function
async function init() {
  try {
    const client = initializeWatchmanClient();

    // checking if watchman is available, if not we run chokidar
    await capabilityCheck(client);

    client.command(["watch-project", dir], (error, resp) => {
      // handling errors
      if (error) {
        log(chalk.red(`Error initiating watch: ${error}`));
        return;
      }

      // handling warnings
      if ("warning" in resp) {
        log(chalk.yellow(`Error initiating watch: ${resp.warning}`));
      }

      // watch established, building subscription
      buildWatchmanSubscription(client, resp.watch);
    });
  } catch (error) {
    // runing chokidars
    log(chalk.yellow(`Running chokidar`));

    const client = inializeChokidarClient({
      persistent: true,
      cwd: dir, // base dir
    });

    client.on("change", path => {
      console.log(`file changed: ${path}`);
    });
  }
}

// builds a watchman subscription aware of the clock
function buildWatchmanSubscription(client: watchman.Client, watch: Watch) {
  client.command(["clock", watch], (error, resp: any) => {
    if (error) {
      console.error(`Failed to query clock: ${error}`);
      return;
    }

    let sub = {
      // Match any `.js` file in the dir_of_interest
      expression: ["anyof", ["match", "*.ts"], ["match", "*.tsx"]],
      // Which fields we're interested in
      fields: ["name", "size", "exists", "type"],
      // add our time constraint
      since: resp.clock,
    };

    client.command(["subscribe", watch, "watcher", sub], (error, resp) => {
      if (error) {
        // The subscription failed
        log(chalk.red(`Failed to subscribe ${error}`));
        return;
      }
      log(chalk.green(`Subscription ${resp.subscribe} established`));
    });

    client.on("subscription", resp => {
      if (resp.subscription !== "watcher") return;

      resp.files.forEach((file: File) => {
        console.log(`file changed: ${file.name} ${JSON.stringify(file)}`);
        // runRelayCompiler();
        buildClient();
      });
    });
  });
}

// runs the relay compiler
function buildClient() {
  const command = "npm";
  const args = ["run", "build:dev"];

  const child = spawn(command, args, { stdio: "inherit" });

  child.on("data", data => {
    log(chalk.grey(`compiling ${data}`));
  });

  child.on("close", code => {
    if (code !== 0) {
      log(chalk.red(`We had an error building ${code}`));
      return;
    }
  });
}

// types
interface File {
  name: string;
}

interface Watch {}

init();
