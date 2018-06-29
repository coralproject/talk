import watchman from "fb-watchman";
import chalk from "chalk";
import path from "path";
import spawn from "cross-spawn";

const log = console.log;

const dir = path.resolve(__dirname, "./src");

interface File {
  name: string;
}

interface Watch {}

function init() {
  const client = new watchman.Client();

  client.capabilityCheck(
    { optional: [], required: ["relative_root"] },
    function(error, resp) {
      if (error) {
        log(chalk.red(`Error in the capability check: ${error}`));
        client.end();
        return;
      }

      // Initiate the watch
      client.command(["watch-project", dir], (error, resp) => {
        // Handling errors
        if (error) {
          log(chalk.red(`Error initiating watch: ${error}`));
          return;
        }

        // Handling warnings
        if ("warning" in resp) {
          log(chalk.yellow(`Error initiating watch: ${resp.warning}`));
        }

        // Watch established, building subscription
        buildSubscription(client, resp.watch);
      });
    }
  );
}

function buildSubscription(client: watchman.Client, watch: Watch) {
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
        runRelayCompiler();
      });
    });
  });
}

function runRelayCompiler() {
  const command = "npm";
  const args = ["run", "compile:relay:stream"];

  const child = spawn(command, args, { stdio: "inherit" });

  child.on("data", data => {
    log(chalk.grey(`buildClient ${data}`));
  });

  child.on("close", code => {
    if (code !== 0) {
      log(chalk.red(`We had an error building ${code}`));
      return;
    }
  });
}

init();
